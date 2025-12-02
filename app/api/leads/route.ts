import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sanitizeText } from '@/lib/chat-utils';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { prisma } from '@/lib/prisma';
import { normalizePhoneNumber, detectUrgency, isOutOfServiceArea } from '@/lib/chat-utils';
import { sendLeadNotification } from '@/lib/telegram';

// Initialize rate limiter (3 submissions per hour per IP)
let ratelimit: Ratelimit | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(3, '1 h'),
      analytics: true,
    });
  }
} catch (error) {
  console.warn('Rate limiting disabled: Upstash Redis not configured');
}

// Zod schema for lead submission
const leadSchema = z.object({
  name: z.string().min(2).max(100),
  phone: z.string().min(10).max(20),
  email: z.string().email().optional(),
  message: z.string().min(10).max(500),
});

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (if configured)
    if (ratelimit) {
      const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
      const { success, limit, reset, remaining } = await ratelimit.limit(`form:${ip}`);
      
      if (!success) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: 'Too many form submissions. Please wait before submitting again.',
            retryAfter: reset,
          },
          {
            status: 429,
            headers: {
              'X-RateLimit-Limit': limit.toString(),
              'X-RateLimit-Remaining': remaining.toString(),
              'X-RateLimit-Reset': reset.toString(),
            },
          }
        );
      }
    }

    const body = await request.json();

    // Validate input with Zod
    const validationResult = leadSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { name, phone, email, message } = validationResult.data;

    // Sanitize inputs
    const sanitizedName = sanitizeText(name);
    const sanitizedMessage = sanitizeText(message);
    const sanitizedEmail = email ? sanitizeText(email) : null;

    // Normalize phone number
    const normalizedPhone = normalizePhoneNumber(phone);
    if (!normalizedPhone) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      );
    }

    // Check for duplicate leads (same phone in last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const existingLead = await prisma.lead.findFirst({
      where: {
        phone: normalizedPhone,
        createdAt: {
          gte: oneHourAgo,
        },
      },
    });

    if (existingLead) {
      return NextResponse.json(
        {
          error: 'Duplicate submission',
          message: 'We already have your request! David will contact you soon.',
        },
        { status: 409 }
      );
    }

    // Detect urgency and priority
    const { urgency, priority } = detectUrgency(sanitizedMessage);

    // Check if out of service area
    const locationText = sanitizedMessage.toLowerCase();
    const isOutOfArea = isOutOfServiceArea(locationText);

    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        name: sanitizedName,
        phone: normalizedPhone,
        email: sanitizedEmail,
        status: isOutOfArea ? 'OUT_OF_AREA' : 'NEW',
        urgency,
        priority,
        source: 'CONTACT_FORM',
        location: null, // Contact form doesn't always have location
        message: sanitizedMessage,
        notes: isOutOfArea
          ? 'Customer submitted via contact form - outside service area'
          : 'Customer submitted via contact form',
      },
    });

    // Create conversation for the lead (for consistency with chat flow)
    const conversation = await prisma.conversation.create({
      data: {
        leadId: lead.id,
        messageCount: 1,
        isActive: true,
      },
    });

    // Create initial message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: sanitizedMessage,
      },
    });

    // Send Telegram notification (only if not out of area and has contact info)
    if (!isOutOfArea && normalizedPhone && sanitizedName) {
      try {
        await sendLeadNotification(lead);
      } catch (error) {
        console.error('Failed to send Telegram notification:', error);
        // Don't fail the request if notification fails
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Lead created successfully',
        leadId: lead.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: 'Something went wrong. Please try again later.',
      },
      { status: 500 }
    );
  }
}

