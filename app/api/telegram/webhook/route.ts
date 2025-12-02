/**
 * Telegram Webhook Endpoint
 * Receives updates from Telegram Bot API
 */

import { NextRequest, NextResponse } from 'next/server';
import { Telegraf, Context } from 'telegraf';
import { prisma } from '@/lib/prisma';
import { isAuthorizedUser, formatConversationHistory, getStats, getAICosts } from '@/lib/telegram';

// Initialize bot
let bot: Telegraf | null = null;

function getBot(): Telegraf {
  if (!bot) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error('TELEGRAM_BOT_TOKEN is not set');
    }
    bot = new Telegraf(token);
    setupBotHandlers(bot);
  }
  return bot;
}

/**
 * Setup bot command handlers
 */
function setupBotHandlers(bot: Telegraf) {
  // Authorization middleware
  bot.use(async (ctx: Context, next) => {
    const userId = ctx.from?.id;
    if (!userId) {
      return;
    }

    // Allow callback queries and commands, but check authorization
    const isTextMessage = ctx.message && 'text' in ctx.message;
    if (ctx.callbackQuery || (isTextMessage && ctx.message.text?.startsWith('/'))) {
      if (!isAuthorizedUser(userId)) {
        await ctx.reply('❌ Unauthorized. You do not have permission to use this bot.');
        return;
      }
    }

    return next();
  });

  // /start command
  bot.command('start', async (ctx) => {
    const welcomeMessage = `
🤖 <b>PipeWorks Lead Bot</b>

Welcome! I'm here to help you manage your leads.

<b>Available Commands:</b>
/start - Show this menu
/help - List all commands
/today - Show today's leads
/stats [week|month] - Show statistics
/costs [week|month] - Show AI costs

<b>Quick Actions:</b>
• Tap buttons in notifications to call customers or view chats
• Use commands to check your leads and stats
    `.trim();

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📊 Today\'s Leads', callback_data: 'today_leads' }],
          [{ text: '🆕 New Leads', callback_data: 'new_leads' }],
          [{ text: '📈 This Week\'s Stats', callback_data: 'stats_week' }],
        ],
      },
    };

    await ctx.reply(welcomeMessage, { parse_mode: 'HTML', ...keyboard });
  });

  // /help command
  bot.command('help', async (ctx) => {
    const helpMessage = `
📖 <b>Available Commands</b>

<b>Lead Management:</b>
/today - Show all leads from today
/today new - Show only new/uncontacted leads

<b>Statistics:</b>
/stats - Show weekly statistics
/stats week - Show weekly statistics
/stats month - Show monthly statistics

<b>Costs:</b>
/costs - Show today's AI costs
/costs week - Show weekly AI costs
/costs month - Show monthly AI costs

<b>Other:</b>
/start - Show main menu
/help - Show this help message

<b>Note:</b> Click buttons in lead notifications for quick actions!
    `.trim();

    await ctx.reply(helpMessage, { parse_mode: 'HTML' });
  });

  // /today command
  bot.command('today', async (ctx) => {
    const messageText = ctx.message && 'text' in ctx.message ? ctx.message.text : '';
    const args = messageText.split(' ') || [];
    const filter = args[1] || 'all';

    const stats = await getStats('today');
    let leads;

    if (filter === 'new') {
      leads = await prisma.lead.findMany({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
          status: 'NEW',
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
    } else {
      leads = await prisma.lead.findMany({
        where: {
          createdAt: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });
    }

    let message = `📊 <b>LEADS TODAY</b>\n\n`;
    message += `Total: ${stats.total} leads\n`;
    message += `🆕 New: ${stats.new}\n`;
    message += `✅ Contacted: ${stats.contacted}\n`;
    message += `💰 Quoted: ${stats.quoted}\n`;
    message += `🎉 Converted: ${stats.converted}\n\n`;
    message += `━━━━━━━━━━━━━━━━━━━━━━\n\n`;

    if (leads.length === 0) {
      message += 'No leads found for today.';
    } else {
      for (const lead of leads) {
        const urgencyEmoji = lead.urgency === 'EMERGENCY' ? '🚨' : lead.urgency === 'URGENT' ? '⚡' : '📅';
        const time = new Date(lead.createdAt).toLocaleTimeString('en-ZA', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
        
        message += `${urgencyEmoji} <b>Lead</b> - ${time}\n`;
        message += `${lead.name || 'Unknown'} | ${lead.location || 'Unknown location'}\n`;
        message += `${lead.message?.substring(0, 50) || 'No description'}...\n`;
        message += `Status: ${lead.status}\n\n`;
      }
    }

    await ctx.reply(message, { parse_mode: 'HTML' });
  });

  // /stats command
  bot.command('stats', async (ctx) => {
    const messageText = ctx.message && 'text' in ctx.message ? ctx.message.text : '';
    const args = messageText.split(' ') || [];
    const period = (args[1] as 'week' | 'month') || 'week';

    const stats = await getStats(period);

    const message = `
📈 <b>STATISTICS - ${period.toUpperCase()}</b>

<b>📊 Leads:</b>
Total: ${stats.total}
🆕 New: ${stats.new}
✅ Contacted: ${stats.contacted}
💰 Quoted: ${stats.quoted}
🎉 Converted: ${stats.converted}
❌ Lost: ${stats.lost}

<b>⚡ By Urgency:</b>
🚨 Emergency: ${stats.emergency}
⚡ Urgent: ${stats.urgent}
📅 Normal: ${stats.normal}

<b>📊 Conversion Rate:</b>
${stats.total > 0 ? ((stats.converted / stats.total) * 100).toFixed(1) : 0}%
    `.trim();

    await ctx.reply(message, { parse_mode: 'HTML' });
  });

  // /costs command
  bot.command('costs', async (ctx) => {
    const messageText = ctx.message && 'text' in ctx.message ? ctx.message.text : '';
    const args = messageText.split(' ') || [];
    const period = (args[1] as 'today' | 'week' | 'month') || 'today';

    const costs = await getAICosts(period);

    const message = `
💰 <b>AI COSTS - ${period.toUpperCase()}</b>

Total Cost: $${costs.totalCost}
Total Requests: ${costs.totalRequests}
Avg per Request: $${costs.avgCostPerRequest}
    `.trim();

    await ctx.reply(message, { parse_mode: 'HTML' });
  });

  // Callback query handlers
  bot.action(/call_(.+)/, async (ctx) => {
    const leadId = ctx.match[1];
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    
    if (!lead) {
      await ctx.answerCbQuery('Lead not found');
      return;
    }

    // Create tel: link
    const phoneLink = `tel:${lead.phone}`;
    await ctx.answerCbQuery(`Calling ${lead.name || 'customer'}...`);
    await ctx.reply(`📞 <a href="${phoneLink}">Call ${lead.name || 'Customer'} at ${lead.phone}</a>`, {
      parse_mode: 'HTML',
    });
  });

  bot.action(/view_chat_(.+)/, async (ctx) => {
    const leadId = ctx.match[1];
    await ctx.answerCbQuery('Loading conversation...');

    try {
      const history = await formatConversationHistory(leadId);
      await ctx.reply(history, { parse_mode: 'HTML' });
    } catch (error) {
      await ctx.reply('❌ Error loading conversation history.');
    }
  });

  bot.action(/contacted_(.+)/, async (ctx) => {
    const leadId = ctx.match[1];
    
    try {
      await prisma.lead.update({
        where: { id: leadId },
        data: { status: 'CONTACTED' },
      });

      await ctx.answerCbQuery('✅ Marked as contacted');
      await ctx.editMessageReplyMarkup({
        inline_keyboard: [
          [
            { text: '📞 Call Customer', callback_data: `call_${leadId}` },
            { text: '👁 View Full Chat', callback_data: `view_chat_${leadId}` },
          ],
          [{ text: '✅ Contacted', callback_data: `contacted_${leadId}` }],
        ],
      });
    } catch (error) {
      await ctx.answerCbQuery('❌ Error updating lead');
    }
  });

  // Callback query handlers for buttons
  bot.action('today_leads', async (ctx) => {
    const stats = await getStats('today');
    await ctx.answerCbQuery(`Today: ${stats.total} leads`);
    // Could trigger /today command logic here
  });

  bot.action('new_leads', async (ctx) => {
    const stats = await getStats('today');
    await ctx.answerCbQuery(`New leads: ${stats.new}`);
  });

  bot.action('stats_week', async (ctx) => {
    const stats = await getStats('week');
    await ctx.answerCbQuery(`Week stats: ${stats.total} leads`);
  });

  // Error handling
  bot.catch((err, ctx) => {
    console.error(`Error for ${ctx.updateType}:`, err);
  });
}

/**
 * POST handler for Telegram webhook
 */
export async function POST(request: NextRequest) {
  try {
    const bot = getBot();
    const body = await request.json();

    // Verify webhook secret if set (optional security measure)
    const webhookSecret = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
    if (process.env.TELEGRAM_WEBHOOK_SECRET && webhookSecret !== process.env.TELEGRAM_WEBHOOK_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Handle update
    await bot.handleUpdate(body);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * GET handler for webhook verification (Telegram will call this to verify)
 */
export async function GET() {
  return NextResponse.json({ message: 'Telegram webhook endpoint is active' });
}

