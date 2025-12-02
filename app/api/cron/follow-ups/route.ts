import { NextRequest, NextResponse } from 'next/server';
import { checkAndSendFollowUps } from '@/lib/follow-ups';

// Mark route as dynamic since it uses request headers
export const dynamic = 'force-dynamic';

/**
 * Cron endpoint for automated follow-ups
 * Runs every 15 minutes to check for leads needing follow-up
 * 
 * Vercel Cron Configuration (vercel.json):
 * Schedule: Every 15 minutes
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

    // Check and send follow-ups
    const results = await checkAndSendFollowUps();

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results,
    });
  } catch (error) {
    console.error('Error in follow-ups cron:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

