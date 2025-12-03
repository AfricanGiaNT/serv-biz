import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { sanitizeText } from '@/lib/chat-utils';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { prisma } from '@/lib/prisma';
import { normalizePhoneNumber, detectUrgency, isOutOfServiceArea } from '@/lib/chat-utils';
import { sendLeadNotification } from '@/lib/telegram';
import { createSupabaseServerClient } from '@/lib/supabase';

/**
 * Extract email provider from email address
 */
function getEmailProvider(email: string): string {
  const domain = email.split('@')[1]?.toLowerCase();
  if (!domain) return 'Unknown';
  
  const providerMap: Record<string, string> = {
    'gmail.com': 'Gmail',
    'googlemail.com': 'Gmail',
    'outlook.com': 'Outlook',
    'hotmail.com': 'Outlook',
    'live.com': 'Outlook',
    'yahoo.com': 'Yahoo',
    'yahoo.co.uk': 'Yahoo',
    'icloud.com': 'iCloud',
    'me.com': 'iCloud',
    'mac.com': 'iCloud',
    'aol.com': 'AOL',
    'protonmail.com': 'ProtonMail',
    'zoho.com': 'Zoho',
  };
  
  return providerMap[domain] || domain;
}

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
  serviceType: z.string().optional(),
  source: z.enum(['WEBSITE_CHAT', 'CONTACT_FORM', 'SERVICES_QUOTE', 'TELEGRAM', 'MANUAL']).optional(),
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

    // Check Content-Type to determine how to parse the request
    const contentType = request.headers.get('content-type') || '';
    let name: string, phone: string, email: string | undefined, message: string;
    let serviceType: string | undefined;
    let source: 'WEBSITE_CHAT' | 'CONTACT_FORM' | 'SERVICES_QUOTE' | 'TELEGRAM' | 'MANUAL' = 'CONTACT_FORM';
    let imageBuffer: Buffer | null = null;
    let imageMimeType: string | null = null;

    if (contentType.includes('multipart/form-data')) {
      // Parse multipart form data
      const formData = await request.formData();
      
      name = formData.get('name') as string;
      phone = formData.get('phone') as string;
      email = formData.get('email') as string || undefined;
      message = formData.get('message') as string;
      serviceType = formData.get('serviceType') as string || undefined;
      const sourceParam = formData.get('source') as string;
      if (sourceParam && ['WEBSITE_CHAT', 'CONTACT_FORM', 'SERVICES_QUOTE', 'TELEGRAM', 'MANUAL'].includes(sourceParam)) {
        source = sourceParam as typeof source;
      }
      
      // Handle image if present
      const imageFile = formData.get('image') as File | null;
      if (imageFile && imageFile.size > 0) {
        // Validate image size (5MB max)
        if (imageFile.size > 5 * 1024 * 1024) {
          return NextResponse.json(
            { error: 'Image file is too large. Maximum size is 5MB.' },
            { status: 400 }
          );
        }
        
        // Validate image type
        if (!['image/jpeg', 'image/jpg', 'image/png'].includes(imageFile.type)) {
          return NextResponse.json(
            { error: 'Invalid image type. Only JPEG and PNG are allowed.' },
            { status: 400 }
          );
        }
        
        // Convert to buffer
        const arrayBuffer = await imageFile.arrayBuffer();
        imageBuffer = Buffer.from(arrayBuffer);
        imageMimeType = imageFile.type;
      }
      
      // Basic validation (Zod would be more complex with FormData)
      if (!name || name.length < 2 || name.length > 100) {
        return NextResponse.json(
          { error: 'Name must be between 2 and 100 characters' },
          { status: 400 }
        );
      }
      if (!phone || phone.length < 10) {
        return NextResponse.json(
          { error: 'Phone number is required' },
          { status: 400 }
        );
      }
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json(
          { error: 'Invalid email address' },
          { status: 400 }
        );
      }
      if (!message || message.length < 10 || message.length > 500) {
        return NextResponse.json(
          { error: 'Message must be between 10 and 500 characters' },
          { status: 400 }
        );
      }
    } else {
      // Parse JSON (backwards compatibility)
      const body = await request.json();
      
      // Validate input with Zod
      const validationResult = leadSchema.safeParse(body);
      if (!validationResult.success) {
        return NextResponse.json(
          { error: 'Validation failed', details: validationResult.error.issues },
          { status: 400 }
        );
      }

      const { name: nameVal, phone: phoneVal, email: emailVal, message: messageVal, serviceType: serviceTypeVal, source: sourceParam } = validationResult.data;
      name = nameVal;
      phone = phoneVal;
      email = emailVal;
      message = messageVal;
      serviceType = serviceTypeVal;
      if (sourceParam) {
        source = sourceParam;
      }
    }

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

    // Get email provider if email provided
    const emailProvider = sanitizedEmail ? getEmailProvider(sanitizedEmail) : null;

    // Create lead in database
    const lead = await prisma.lead.create({
      data: {
        name: sanitizedName,
        phone: normalizedPhone,
        email: sanitizedEmail,
        status: isOutOfArea ? 'OUT_OF_AREA' : 'NEW',
        urgency,
        priority,
        source: source,
        serviceType: serviceType ? sanitizeText(serviceType) : null,
        attachmentUrl: null, // Will be populated if we implement cloud storage for images
        location: null, // Contact form doesn't always have location
        message: sanitizedMessage,
        notes: isOutOfArea
          ? 'Customer submitted via contact form - outside service area'
          : emailProvider 
            ? `Customer submitted via ${source === 'SERVICES_QUOTE' ? 'services quotation form' : 'contact form'} - Email provider: ${emailProvider}`
            : `Customer submitted via ${source === 'SERVICES_QUOTE' ? 'services quotation form' : 'contact form'}`,
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
        await sendLeadNotification(lead, imageBuffer, emailProvider, source, serviceType);
      } catch (error) {
        console.error('Failed to send Telegram notification:', error);
        // Don't fail the request if notification fails
      }
    }

    // Update Supabase analytics_daily_summary
    try {
      const supabase = createSupabaseServerClient();
      const today = new Date().toISOString().split('T')[0];

      const { data: existing } = await supabase
        .from('analytics_daily_summary')
        .select('*')
        .eq('date', today)
        .single();

      if (existing) {
        await supabase
          .from('analytics_daily_summary')
          .update({
            total_leads: existing.total_leads + 1,
          })
          .eq('date', today);
      } else {
        await supabase
          .from('analytics_daily_summary')
          .insert({
            date: today,
            total_visits: 0,
            bounced_visits: 0,
            total_leads: 1,
            converted_leads: 0,
          });
      }
    } catch (error) {
      console.error('Failed to update Supabase analytics:', error);
      // Don't fail the request if analytics update fails
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

