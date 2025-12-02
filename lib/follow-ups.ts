/**
 * Follow-up system for uncontacted leads
 * Sends automated follow-up messages if lead hasn't been contacted within 2 hours
 */

import { prisma } from './prisma';
import { sendLeadNotification } from './telegram';

const FOLLOW_UP_DELAY_HOURS = 2;

/**
 * Check for leads that need follow-up
 * A lead needs follow-up if:
 * - Status is still "NEW" (not contacted)
 * - Created more than 2 hours ago
 * - Follow-up hasn't been sent yet
 */
export async function checkAndSendFollowUps() {
  try {
    const twoHoursAgo = new Date(Date.now() - FOLLOW_UP_DELAY_HOURS * 60 * 60 * 1000);
    const now = new Date();

    // Find leads that need follow-up
    // Only NEW leads that haven't been contacted and follow-up hasn't been sent
    const leadsNeedingFollowUp = await prisma.lead.findMany({
      where: {
        status: 'NEW', // Only uncontacted leads
        followUpSent: false, // Follow-up not sent yet
        createdAt: {
          lte: twoHoursAgo, // Created more than 2 hours ago
        },
      },
      include: {
        conversations: {
          include: {
            messages: {
              orderBy: { createdAt: 'asc' },
              take: 1,
            },
          },
        },
      },
    });

    const results = {
      checked: leadsNeedingFollowUp.length,
      sent: 0,
      errors: 0,
      skipped: 0,
    };

    for (const lead of leadsNeedingFollowUp) {
      try {
        // Skip if lead doesn't have contact info
        if (!lead.phone || !lead.name) {
          results.skipped++;
          continue;
        }

        // Generate personalized follow-up message
        const followUpMessage = generateFollowUpMessage(lead);

        // For MVP, we'll just send a Telegram notification to David
        // In the future, this could send SMS/WhatsApp to the customer
        await sendFollowUpNotification(lead, followUpMessage);

        // Mark follow-up as sent
        await prisma.lead.update({
          where: { id: lead.id },
          data: {
            followUpSent: true,
            followUpAt: now,
          },
        });

        results.sent++;
      } catch (error) {
        console.error(`Error sending follow-up for lead ${lead.id}:`, error);
        results.errors++;
      }
    }

    return results;
  } catch (error) {
    console.error('Error checking follow-ups:', error);
    throw error;
  }
}

/**
 * Generate personalized follow-up message
 */
function generateFollowUpMessage(lead: any): string {
  const customerName = lead.name?.split(' ')[0] || 'there';
  const problem = lead.message || 'your plumbing issue';
  const phone = lead.phone;

  return `Hi ${customerName}, this is PipeWorks. We received your request about ${problem}. David is currently on a job but will call you within the hour. For immediate emergencies, call 011-555-1234. - PipeWorks Team`;
}

/**
 * Send follow-up notification to David via Telegram
 * This alerts David that a follow-up should be sent to the customer
 */
async function sendFollowUpNotification(lead: any, followUpMessage: string) {
  try {
    const authorizedUserId = process.env.TELEGRAM_USER_ID || process.env.AUTHORIZED_TELEGRAM_USER_ID;
    if (!authorizedUserId) {
      console.warn('⚠️ TELEGRAM_USER_ID not set - cannot send follow-up notification');
      return;
    }

    const bot = (await import('./telegram')).getBot();
    
    const message = `🤖 AUTO FOLLOW-UP REMINDER\n\n` +
      `Lead #${lead.id.substring(0, 8)} - ${lead.name}\n` +
      `📞 ${lead.phone}\n` +
      `⏰ Created: ${new Date(lead.createdAt).toLocaleString('en-ZA')}\n` +
      `\n📝 Suggested Follow-up Message:\n"${followUpMessage}"\n\n` +
      `⚠️ Please contact this lead ASAP - it's been ${FOLLOW_UP_DELAY_HOURS} hours since they submitted.`;

    await bot.telegram.sendMessage(authorizedUserId, message, {
      parse_mode: 'HTML',
    });
  } catch (error) {
    console.error('Error sending follow-up notification:', error);
    throw error;
  }
}

/**
 * Get leads that are due for follow-up (for testing/debugging)
 */
export async function getLeadsDueForFollowUp() {
  const twoHoursAgo = new Date(Date.now() - FOLLOW_UP_DELAY_HOURS * 60 * 60 * 1000);

  return await prisma.lead.findMany({
    where: {
      status: 'NEW',
      followUpSent: false,
      createdAt: {
        lte: twoHoursAgo,
      },
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
}

