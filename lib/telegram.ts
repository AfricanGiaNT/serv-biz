/**
 * Telegram Bot Module
 * Handles sending notifications and bot commands for PipeWorks
 */

import { Telegraf, Context, Markup } from 'telegraf';
import { prisma } from './prisma';
import type { Lead, Conversation, Message } from './generated/prisma/client';

// Initialize bot (for webhook mode, we'll use it in the webhook route)
let bot: Telegraf | null = null;

export function getBot(): Telegraf {
  if (!bot) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set');
    }
    bot = new Telegraf(token);
  }
  return bot;
}

/**
 * Get urgency emoji and indicator
 */
function getUrgencyIndicator(urgency: string): string {
  switch (urgency) {
    case 'EMERGENCY':
      return '🚨';
    case 'URGENT':
      return '⚡';
    case 'NORMAL':
      return '📅';
    case 'LOW':
      return '📅';
    default:
      return '📅';
  }
}

/**
 * Format lead notification message
 */
function formatLeadNotification(
  lead: Lead & { conversations?: (Conversation & { messages?: Message[] })[] },
  emailProvider?: string | null,
  source?: string,
  serviceType?: string | null
): string {
  const urgencyEmoji = getUrgencyIndicator(lead.urgency);
  const urgencyText = lead.urgency === 'EMERGENCY' ? 'EMERGENCY' : lead.urgency === 'URGENT' ? 'URGENT' : 'STANDARD';

  // Determine if this is a quotation request
  const isQuotation = source === 'SERVICES_QUOTE' || lead.source === 'SERVICES_QUOTE';
  const headerText = isQuotation ? 'NEW QUOTATION REQUEST' : 'NEW LEAD';

  let message = `${urgencyEmoji} ${headerText} - ${urgencyText}\n\n`;
  
  // Add source information
  const sourceLabels: Record<string, string> = {
    WEBSITE_CHAT: 'Website Chat',
    CONTACT_FORM: 'Contact Form',
    SERVICES_QUOTE: 'Services Quotation',
    TELEGRAM: 'Telegram',
    MANUAL: 'Manual Entry'
  };
  const sourceLabel = sourceLabels[lead.source] || lead.source;
  message += `📍 Source: ${sourceLabel}\n`;
  
  if (serviceType || lead.serviceType) {
    message += `🔧 Service Type: ${serviceType || lead.serviceType}\n`;
  }
  
  message += `\n👤 Name: ${lead.name || 'Not provided'}\n`;
  message += `📞 Phone: ${lead.phone}\n`;
  if (lead.email) {
    if (emailProvider) {
      message += `📧 Email: ${lead.email} (${emailProvider})\n`;
    } else {
      message += `📧 Email: ${lead.email}\n`;
    }
  }
  if (lead.location) {
    message += `📍 Location: ${lead.location}\n`;
  }
  message += `\n🚨 ${isQuotation ? 'Request Details' : 'Problem'}: ${lead.message || 'No description'}\n`;
  
  if (lead.notes) {
    message += `\n🤖 AI Notes:\n${lead.notes}\n`;
  }

  message += `\n⏰ Received: ${new Date(lead.createdAt).toLocaleString('en-ZA', { 
    dateStyle: 'short', 
    timeStyle: 'short' 
  })}`;

  return message;
}

/**
 * Send lead notification to Telegram (with optional image)
 */
export async function sendLeadNotification(
  lead: Lead & { conversations?: (Conversation & { messages?: Message[] })[] },
  imageBuffer?: Buffer | null,
  emailProvider?: string | null,
  source?: string,
  serviceType?: string | null
) {
  try {
    const authorizedUserId = process.env.TELEGRAM_USER_ID || process.env.AUTHORIZED_TELEGRAM_USER_ID;
    if (!authorizedUserId) {
      console.warn('⚠️ TELEGRAM_USER_ID not set - cannot send notifications');
      return;
    }

    const bot = getBot();
    const message = formatLeadNotification(lead, emailProvider, source, serviceType);

    // Create inline keyboard buttons
    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback('📞 Call Customer', `call_${lead.id}`),
        Markup.button.callback('👁 View Full Chat', `view_chat_${lead.id}`),
      ],
      [
        Markup.button.callback('✅ Mark as Contacted', `contacted_${lead.id}`),
      ],
    ]);

    let sentMessage;

    // If image is provided, send photo with caption
    if (imageBuffer && imageBuffer.length > 0) {
      sentMessage = await bot.telegram.sendPhoto(
        authorizedUserId,
        { source: imageBuffer },
        {
          caption: message,
          ...keyboard,
        }
      );
    } else {
      // Send text message
      sentMessage = await bot.telegram.sendMessage(authorizedUserId, message, {
        ...keyboard,
      });
    }

    // Save Telegram message ID to lead for future updates
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        // Note: We'll need to add telegramMessageId to schema if needed
        // For now, we'll just send the notification
      },
    });

    return sentMessage;
  } catch (error) {
    console.error('❌ Error sending Telegram notification:', error);
    throw error;
  }
}

/**
 * Format conversation history for display
 */
async function formatConversationHistory(leadId: string): Promise<string> {
  const lead = await prisma.lead.findUnique({
    where: { id: leadId },
    include: {
      conversations: {
        include: {
          messages: {
            orderBy: { createdAt: 'asc' },
          },
        },
      },
    },
  });

  if (!lead || !lead.conversations || lead.conversations.length === 0) {
    return 'No conversation history found for this lead.';
  }

  let history = `💬 CONVERSATION HISTORY\n\n`;
  history += `👤 ${lead.name || 'Customer'}\n`;
  history += `📞 ${lead.phone}\n`;
  history += `\n━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  // Get all messages from all conversations
  const allMessages: Array<{ role: string; content: string; createdAt: Date }> = [];
  
  for (const conv of lead.conversations) {
    if (conv.messages) {
      for (const msg of conv.messages) {
        allMessages.push({
          role: msg.role,
          content: msg.content,
          createdAt: msg.createdAt,
        });
      }
    }
  }

  // Sort by creation time
  allMessages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  // Format messages
  for (const msg of allMessages) {
    const sender = msg.role === 'USER' ? '👤 Customer' : '🤖 AI Assistant';
    const time = new Date(msg.createdAt).toLocaleTimeString('en-ZA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    history += `${sender} (${time}):\n`;
    history += `${msg.content}\n\n`;
  }

  return history;
}

/**
 * Check if user is authorized to use bot
 */
export function isAuthorizedUser(userId: number | string): boolean {
  const authorizedUserId = process.env.TELEGRAM_USER_ID || process.env.AUTHORIZED_TELEGRAM_USER_ID;
  if (!authorizedUserId) {
    return false;
  }
  return String(userId) === String(authorizedUserId);
}

/**
 * Get stats for a period
 * Uses analytics module for accurate stats
 */
async function getStats(period: 'today' | 'week' | 'month') {
  const { getStatsForPeriod } = await import('./analytics');
  
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 7));
  }

  const endDate = new Date();

  // Use analytics module for accurate stats
  const aggregated = await getStatsForPeriod(startDate, endDate);

  // Also get real-time lead counts for today (for /today command)
  if (period === 'today') {
    const todayLeads = await prisma.lead.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return {
      total: todayLeads.length,
      new: todayLeads.filter(l => l.status === 'NEW').length,
      contacted: todayLeads.filter(l => l.status === 'CONTACTED').length,
      quoted: todayLeads.filter(l => l.status === 'QUOTED').length,
      converted: todayLeads.filter(l => l.status === 'CONVERTED').length,
      lost: todayLeads.filter(l => l.status === 'LOST').length,
      emergency: todayLeads.filter(l => l.urgency === 'EMERGENCY').length,
      urgent: todayLeads.filter(l => l.urgency === 'URGENT').length,
      normal: todayLeads.filter(l => l.urgency === 'NORMAL').length,
    };
  }

  // For week/month, use aggregated stats
  return {
    total: aggregated.totalLeads,
    new: aggregated.newLeads,
    contacted: aggregated.contactedLeads,
    quoted: 0, // Not tracked in DailyStats yet
    converted: aggregated.convertedLeads,
    lost: 0, // Not tracked in DailyStats yet
    emergency: aggregated.emergencyLeads,
    urgent: 0, // Not tracked separately in DailyStats
    normal: aggregated.totalLeads - aggregated.emergencyLeads,
  };
}

/**
 * Get AI costs for a period
 * Uses analytics module for accurate costs
 */
async function getAICosts(period: 'today' | 'week' | 'month') {
  const { getAICosts } = await import('./analytics');
  
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 7));
  }

  const endDate = new Date();

  const costs = await getAICosts(startDate, endDate);

  return {
    totalCost: costs.totalCostUSD,
    totalRequests: costs.totalRequests,
    avgCostPerRequest: costs.avgCostPerRequest,
  };
}

export { formatConversationHistory, getStats, getAICosts };

