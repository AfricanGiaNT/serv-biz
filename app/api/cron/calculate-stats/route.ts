import { NextRequest, NextResponse } from 'next/server';
import { calculateDailyStats } from '@/lib/analytics';

// Mark route as dynamic since it uses request headers
export const dynamic = 'force-dynamic';

/**
 * Cron endpoint for calculating daily stats
 * Runs at 1 AM daily to calculate stats for the previous day
 * 
 * Vercel Cron Configuration (vercel.json):
 * Schedule: Daily at 1 AM
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret (Vercel sends this header)
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // In production, verify the secret
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // For local testing, allow without secret
      if (process.env.NODE_ENV === 'production') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // Calculate stats for yesterday (default) or today if specified
    const queryParams = new URL(request.url).searchParams;
    const dateParam = queryParams.get('date');
    const targetDate = dateParam ? new Date(dateParam) : new Date();

    // If no date specified, calculate for yesterday
    if (!dateParam) {
      targetDate.setDate(targetDate.getDate() - 1);
    }

    const stats = await calculateDailyStats(targetDate);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      date: targetDate.toISOString().split('T')[0],
      stats,
    });
  } catch (error) {
    console.error('Error in calculate-stats cron:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

