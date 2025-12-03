import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

/**
 * Track user interactions to remove bounce classification
 * POST /api/analytics/track-interaction
 * Body: { sessionId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId || typeof sessionId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input. Expected { sessionId: string }' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    // Update the visit record to mark interaction
    await supabase
      .from('analytics_visits')
      .update({ has_interaction: true })
      .eq('session_id', sessionId)
      .eq('has_interaction', false);

    // Get today's date (YYYY-MM-DD format)
    const today = new Date().toISOString().split('T')[0];

    // Decrement bounced visits in daily summary
    const { data: existing } = await supabase
      .from('analytics_daily_summary')
      .select('*')
      .eq('date', today)
      .single();

    if (existing && existing.bounced_visits > 0) {
      await supabase
        .from('analytics_daily_summary')
        .update({
          bounced_visits: existing.bounced_visits - 1,
        })
        .eq('date', today);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error tracking interaction:', error);
    // Don't fail loudly - analytics shouldn't break the user experience
    return NextResponse.json({ success: false }, { status: 200 });
  }
}



