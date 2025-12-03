/**
 * Analytics module for calculating daily stats and AI costs
 */

import { prisma } from './prisma';

/**
 * Calculate daily stats for a specific date
 * This aggregates all leads, conversions, and response times for the day
 */
export async function calculateDailyStats(date: Date = new Date()) {
  try {
    // Set to start of day
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    // Set to end of day
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get all leads from this day
    const leads = await prisma.lead.findMany({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    // Calculate metrics
    const totalLeads = leads.length;
    const newLeads = leads.filter((l: any) => l.status === 'NEW').length;
    const contactedLeads = leads.filter((l: any) => l.status === 'CONTACTED').length;
    const convertedLeads = leads.filter((l: any) => l.status === 'CONVERTED').length;
    const emergencyLeads = leads.filter((l: any) => l.urgency === 'EMERGENCY').length;
    // Update to handle new source enum values (backwards compatible)
    const chatLeads = leads.filter((l: any) => l.source === 'WEBSITE_CHAT' || l.source === 'CHATBOT').length;
    const formLeads = leads.filter((l: any) => l.source === 'CONTACT_FORM' || l.source === 'SERVICES_QUOTE').length;

    // Calculate average response time (in minutes)
    // This would require tracking when leads were contacted
    // For now, we'll set it to null and calculate it properly when we have that data
    const avgResponseTime = null;

    // Calculate conversion rate (converted / total)
    const conversionRate = totalLeads > 0 
      ? (convertedLeads / totalLeads) * 100 
      : 0;

    // Upsert daily stats
    const stats = await prisma.dailyStats.upsert({
      where: {
        date: startOfDay,
      },
      update: {
        totalLeads,
        newLeads,
        contactedLeads,
        convertedLeads,
        emergencyLeads,
        chatLeads,
        formLeads,
        avgResponseTime,
        conversionRate,
      },
      create: {
        date: startOfDay,
        totalLeads,
        newLeads,
        contactedLeads,
        convertedLeads,
        emergencyLeads,
        chatLeads,
        formLeads,
        avgResponseTime,
        conversionRate,
      },
    });

    return stats;
  } catch (error) {
    console.error('Error calculating daily stats:', error);
    throw error;
  }
}

/**
 * Get stats for a date range
 */
export async function getStatsForPeriod(startDate: Date, endDate: Date) {
  try {
    const stats = await prisma.dailyStats.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    // Aggregate totals
    const aggregated = {
      totalLeads: stats.reduce((sum: number, s: any) => sum + s.totalLeads, 0),
      newLeads: stats.reduce((sum: number, s: any) => sum + s.newLeads, 0),
      contactedLeads: stats.reduce((sum: number, s: any) => sum + s.contactedLeads, 0),
      convertedLeads: stats.reduce((sum: number, s: any) => sum + s.convertedLeads, 0),
      emergencyLeads: stats.reduce((sum: number, s: any) => sum + s.emergencyLeads, 0),
      chatLeads: stats.reduce((sum: number, s: any) => sum + s.chatLeads, 0),
      formLeads: stats.reduce((sum: number, s: any) => sum + s.formLeads, 0),
      avgResponseTime: stats.length > 0
        ? Math.round(
            stats.reduce((sum, s) => sum + (s.avgResponseTime || 0), 0) / stats.length
          )
        : null,
      conversionRate: stats.length > 0
        ? stats.reduce((sum, s) => sum + Number(s.conversionRate || 0), 0) / stats.length
        : 0,
      dailyBreakdown: stats,
    };

    return aggregated;
  } catch (error) {
    console.error('Error getting stats for period:', error);
    throw error;
  }
}

/**
 * Get AI costs for a date range
 */
export async function getAICosts(startDate: Date, endDate: Date) {
  try {
    const stats = await prisma.aIUsageStats.findMany({
      where: {
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const totalCost = stats.reduce((sum: number, s: any) => sum + Number(s.totalCost || 0), 0);
    const totalTokens = stats.reduce((sum: number, s: any) => sum + s.totalTokens, 0);
    const totalRequests = stats.reduce((sum: number, s: any) => sum + s.requestCount, 0);

    return {
      totalCostUSD: totalCost.toFixed(2),
      totalTokens,
      totalRequests,
      avgCostPerRequest: totalRequests > 0 ? (totalCost / totalRequests).toFixed(4) : '0.0000',
      breakdown: stats.map(s => ({
        date: s.date,
        cost: Number(s.totalCost || 0).toFixed(2),
        tokens: s.totalTokens,
        requests: s.requestCount,
      })),
    };
  } catch (error) {
    console.error('Error getting AI costs:', error);
    throw error;
  }
}

/**
 * Update AI usage stats (called from chat API when processing messages)
 */
export async function updateAIUsageStats(tokens: number, cost: number) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get or create today's stats
    const existing = await prisma.aIUsageStats.findUnique({
      where: {
        date: today,
      },
    });

    if (existing) {
      // Update existing stats
      await prisma.aIUsageStats.update({
        where: {
          date: today,
        },
        data: {
          totalTokens: existing.totalTokens + tokens,
          totalCost: Number(existing.totalCost) + cost,
          requestCount: existing.requestCount + 1,
        },
      });
    } else {
      // Create new stats
      await prisma.aIUsageStats.create({
        data: {
          date: today,
          totalTokens: tokens,
          totalCost: cost,
          requestCount: 1,
        },
      });
    }
  } catch (error) {
    console.error('Error updating AI usage stats:', error);
    // Don't throw - this shouldn't break the chat flow
  }
}

/**
 * Get leads breakdown by source and status for a date range
 */
export async function getLeadsBreakdown(startDate: Date, endDate: Date) {
  try {
    const leads = await prisma.lead.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Group by source
    const leadsBySource = {
      WEBSITE_CHAT: leads.filter((l: any) => l.source === 'WEBSITE_CHAT').length,
      CONTACT_FORM: leads.filter((l: any) => l.source === 'CONTACT_FORM').length,
      SERVICES_QUOTE: leads.filter((l: any) => l.source === 'SERVICES_QUOTE').length,
      TELEGRAM: leads.filter((l: any) => l.source === 'TELEGRAM').length,
      MANUAL: leads.filter((l: any) => l.source === 'MANUAL').length,
    };

    // Group by status
    const leadsByStatus = {
      NEW: leads.filter((l: any) => l.status === 'NEW').length,
      CONTACTED: leads.filter((l: any) => l.status === 'CONTACTED').length,
      QUOTED: leads.filter((l: any) => l.status === 'QUOTED').length,
      CONVERTED: leads.filter((l: any) => l.status === 'CONVERTED').length,
      LOST: leads.filter((l: any) => l.status === 'LOST').length,
      OUT_OF_AREA: leads.filter((l: any) => l.status === 'OUT_OF_AREA').length,
    };

    return {
      leadsBySource,
      leadsByStatus,
      totalLeads: leads.length,
    };
  } catch (error) {
    console.error('Error getting leads breakdown:', error);
    throw error;
  }
}

