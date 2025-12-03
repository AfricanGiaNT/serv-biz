import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { prisma } from '@/lib/prisma';
import {
  extractPhoneNumber,
  extractEmail,
  extractName,
  detectUrgency,
  isOutOfServiceArea,
  normalizePhoneNumber,
} from '@/lib/chat-utils';
import { sanitizeText } from '@/lib/chat-utils';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { sendLeadNotification } from '@/lib/telegram';
import { createSupabaseServerClient } from '@/lib/supabase';

// Initialize rate limiter (10 requests per minute per IP)
// Falls back gracefully if Upstash isn't configured
let ratelimit: Ratelimit | null = null;
try {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '1 m'),
      analytics: true,
    });
  }
} catch (error) {
  console.warn('Rate limiting disabled: Upstash Redis not configured');
}

// Initialize OpenAI client (will throw if API key is missing)
let openai: OpenAI | null = null;
try {
  if (!process.env.OPENAI_API_KEY) {
    console.error('OPENAI_API_KEY is not set in environment variables');
  } else {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
}

// System prompt for PipeWorks
const SYSTEM_PROMPT = `You are a friendly and helpful AI assistant for PipeWorks, a professional plumbing service business in Johannesburg, South Africa.

Your role:
- Help customers with plumbing-related inquiries
- Qualify leads by gathering essential information (name, phone, location, issue description)
- Provide helpful information about services and pricing when asked
- Be polite but firm when customers are outside the service area (Johannesburg only)
- Escalate to phone contact after gathering enough information

Key Information:
- Business: PipeWorks Plumbing Services
- Location: Johannesburg, South Africa
- Service Area: Johannesburg only
- Emergency Contact: +27 11 234 5678
- Services: Leak repairs, geyser services, blocked drains, emergency plumbing, bathroom renovations
- Pricing: R400-R25,000 depending on service type

Guidelines:
- Be friendly, professional, and empathetic
- Ask for contact information naturally during conversation
- If customer is outside Johannesburg, politely explain service area limitations
- If urgent/emergency is mentioned, acknowledge it and offer to connect them immediately
- If customer asks to "connect to a person", "speak to someone", "talk to a human", or similar, acknowledge their request and let them know a form will appear to collect their information
- After gathering contact info and understanding the issue, suggest they'll be contacted soon
- Keep responses concise but helpful
- Don't make promises about specific pricing without consultation

Important: Always be helpful and never appear frustrated. This is a service business that depends on customer satisfaction.`;

const MAX_MESSAGES = 15;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting (if configured)
    if (ratelimit) {
      const ip = request.ip ?? request.headers.get('x-forwarded-for') ?? 'unknown';
      const { success, limit, reset, remaining } = await ratelimit.limit(`chat:${ip}`);
      
      if (!success) {
        return NextResponse.json(
          {
            error: 'Rate limit exceeded',
            message: 'Too many requests. Please wait a moment before sending another message.',
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
    const { message, conversationId, messageCount } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Sanitize input
    const sanitizedMessage = sanitizeText(message);

    // Early detection: Check if user wants to connect to a person (before AI call)
    const userMessageLower = sanitizedMessage.toLowerCase();
    const wantsToConnectEarly = 
      userMessageLower.includes('connect') && (userMessageLower.includes('person') || userMessageLower.includes('perso') || userMessageLower.includes('human')) ||
      userMessageLower.includes('speak to someone') ||
      userMessageLower.includes('talk to') && (userMessageLower.includes('human') || userMessageLower.includes('person') || userMessageLower.includes('someone')) ||
      userMessageLower.includes('human agent') ||
      userMessageLower.includes('real person') ||
      (userMessageLower.includes('customer') && (userMessageLower.includes('service') || userMessageLower.includes('support'))) ||
      userMessageLower.includes('speak with') && (userMessageLower.includes('someone') || userMessageLower.includes('person'));

    // Check message limit
    if (messageCount >= MAX_MESSAGES) {
      return NextResponse.json({
        message:
          "Thank you for chatting! I've gathered enough information. Please call us directly at +27 11 234 5678 for immediate assistance. Our team will be happy to help you with your plumbing needs.",
        conversationId,
        leadCreated: false,
      });
    }

    let conversation = null;
    let lead = null;

    // Get or create conversation
    if (conversationId) {
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId },
        include: {
          lead: true,
          messages: {
            orderBy: { createdAt: 'asc' },
            take: 50, // Last 50 messages for context
          },
        },
      });

      if (conversation) {
        lead = conversation.lead;
      }
    }

    // If user wants to connect to a person, return early with form flag
    if (wantsToConnectEarly && conversation) {
      // Save user message
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          role: 'USER',
          content: sanitizedMessage,
        },
      });

      // Update conversation message count
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: {
          messageCount: {
            increment: 1,
          },
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        message: "I'd be happy to connect you with David from our team! Please fill out the contact form below with your details, and David will reach out to you within 30 minutes. 📝",
        conversationId: conversation.id,
        leadCreated: !!lead,
        messageCount: conversation.messageCount + 1,
        showForm: true, // Show the contact form immediately
      });
    }

    // Create new conversation and lead if this is the first message
    if (!conversation) {
      // Extract contact information from the message
      const phone = extractPhoneNumber(sanitizedMessage);
      const email = extractEmail(sanitizedMessage);
      const name = extractName(sanitizedMessage);
      const { urgency, priority } = detectUrgency(sanitizedMessage);

      // Normalize phone if found
      const normalizedPhone = phone ? normalizePhoneNumber(phone) : null;

      // Check for duplicate leads (same phone in last hour)
      let existingLead = null;
      if (normalizedPhone) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        existingLead = await prisma.lead.findFirst({
          where: {
            phone: normalizedPhone,
            createdAt: {
              gte: oneHourAgo,
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      }

      // Use existing lead or create new one
      if (existingLead) {
        lead = existingLead;
        conversation = await prisma.conversation.findFirst({
          where: {
            leadId: lead.id,
            isActive: true,
          },
        });
      } else {
        // Check if out of service area
        const locationText = sanitizedMessage.toLowerCase();
        const isOutOfArea = isOutOfServiceArea(locationText);

        lead = await prisma.lead.create({
          data: {
            name: name || null,
            phone: normalizedPhone || 'unknown',
            email: email || null,
            status: isOutOfArea ? 'OUT_OF_AREA' : 'NEW',
            urgency,
            priority,
            source: 'WEBSITE_CHAT',
            serviceType: null,
            attachmentUrl: null,
            location: locationText.includes('location') || locationText.includes('area') 
              ? sanitizedMessage 
              : null,
            message: sanitizedMessage,
            notes: isOutOfArea 
              ? 'Customer is outside service area (Johannesburg only)'
              : null,
          },
        });

        conversation = await prisma.conversation.create({
          data: {
            leadId: lead.id,
            messageCount: 1,
            isActive: true,
          },
        });

        // Send Telegram notification for qualified leads (has contact info and not out of area)
        if (!isOutOfArea && normalizedPhone && normalizedPhone !== 'unknown' && name) {
          try {
            await sendLeadNotification(lead);
          } catch (error) {
            console.error('Failed to send Telegram notification:', error);
            // Don't fail the request if notification fails
          }
        }

        // Update Supabase analytics_daily_summary for new lead
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
      }
    }

    // Ensure conversation exists (should never be null at this point, but TypeScript needs this)
    if (!conversation) {
      return NextResponse.json(
        { error: 'Failed to create or find conversation' },
        { status: 500 }
      );
    }

    // Save user message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'USER',
        content: sanitizedMessage,
      },
    });

    // Get conversation history for context
    const history = await prisma.message.findMany({
      where: { conversationId: conversation.id },
      orderBy: { createdAt: 'asc' },
      take: 50,
    });

    // Build messages array for OpenAI
    const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.map((msg) => ({
        role: msg.role.toLowerCase() as 'user' | 'assistant' | 'system',
        content: msg.content,
      })),
      { role: 'user', content: sanitizedMessage },
    ];

    // Check if OpenAI is configured
    if (!openai) {
      console.error('OpenAI client not initialized - check OPENAI_API_KEY environment variable');
      return NextResponse.json(
        {
          error: 'AI service unavailable',
          message: 'I\'m sorry, I\'m having trouble right now. Please try again or call us at +27 11 234 5678.',
        },
        { status: 503 }
      );
    }

    // Call OpenAI API
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      stream: true,
      temperature: 0.7,
      max_tokens: 500,
    });

    // Collect streamed response
    let fullResponse = '';
    let tokenCount = 0;

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      fullResponse += content;
      tokenCount += content.length / 4; // Rough token estimation
    }

    // Calculate cost (approximate - gpt-4o-mini pricing as of 2024)
    const inputTokens = messages.reduce((acc, msg) => acc + (typeof msg.content === 'string' ? msg.content.length / 4 : 0), 0);
    const outputTokens = tokenCount;
    // gpt-4o-mini: $0.15 per 1M input tokens, $0.60 per 1M output tokens
    const cost = (inputTokens / 1_000_000) * 0.15 + (outputTokens / 1_000_000) * 0.6;

    // Save assistant message
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        role: 'ASSISTANT',
        content: fullResponse,
        tokens: Math.round(outputTokens),
        cost: cost,
      },
    });

    // Update conversation message count
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        messageCount: {
          increment: 1,
        },
        updatedAt: new Date(),
      },
    });

    // Update AI usage stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    await prisma.aIUsageStats.upsert({
      where: { date: today },
      update: {
        totalTokens: { increment: Math.round(inputTokens + outputTokens) },
        totalCost: { increment: cost },
        requestCount: { increment: 1 },
      },
      create: {
        date: today,
        totalTokens: Math.round(inputTokens + outputTokens),
        totalCost: cost,
        requestCount: 1,
      },
    });

    // Check if we should update lead with extracted information
    if (lead && lead.status === 'NEW') {
      const newPhone = extractPhoneNumber(sanitizedMessage);
      const newEmail = extractEmail(sanitizedMessage);
      const newName = extractName(sanitizedMessage);
      const { urgency: newUrgency, priority: newPriority } = detectUrgency(sanitizedMessage);

      const updateData: any = {};

      if (newPhone && normalizePhoneNumber(newPhone) && lead.phone === 'unknown') {
        updateData.phone = normalizePhoneNumber(newPhone);
      }

      if (newEmail && !lead.email) {
        updateData.email = newEmail;
      }

      if (newName && !lead.name) {
        updateData.name = newName;
      }

      if (newUrgency !== lead.urgency) {
        updateData.urgency = newUrgency;
        updateData.priority = newPriority;
      }

      if (Object.keys(updateData).length > 0) {
        await prisma.lead.update({
          where: { id: lead.id },
          data: updateData,
        });
      }
    }

    // Check if response indicates out of area
    if (fullResponse.toLowerCase().includes('outside') || fullResponse.toLowerCase().includes('not in our service area')) {
      if (lead && lead.status !== 'OUT_OF_AREA') {
        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            status: 'OUT_OF_AREA',
            notes: 'Customer confirmed to be outside service area',
          },
        });
      }
    }

    // Check if user wants to connect to a person (reuse earlier detection)
    const wantsToConnect = wantsToConnectEarly;

    return NextResponse.json({
      message: fullResponse,
      conversationId: conversation.id,
      leadCreated: !!lead,
      messageCount: conversation.messageCount,
      showForm: wantsToConnect, // Flag to show contact form
    });
  } catch (error: any) {
    console.error('Chat API error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error details:', {
      message: error.message,
      name: error.name,
      cause: error.cause,
    });
    
    // Return user-friendly error message
    return NextResponse.json(
      {
        error: 'Failed to process chat message',
        message: 'I\'m sorry, I\'m having trouble right now. Please try again or call us at +27 11 234 5678.',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

