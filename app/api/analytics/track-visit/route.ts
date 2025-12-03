import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseServerClient } from '@/lib/supabase';

/**
 * Track page visits and interactions for analytics
 * POST /api/analytics/track-visit
 * Body: { path: string, sessionId: string }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { path, sessionId } = body;

    // Validate input
    if (typeof path !== 'string' || typeof sessionId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input. Expected { path: string, sessionId: string }' },
        { status: 400 }
      );
    }

    const supabase = createSupabaseServerClient();

    // Insert visit record into analytics_visits
    const { error: insertError } = await supabase
      .from('analytics_visits')
      .insert({
        path,
        session_id: sessionId,
        has_interaction: false,
        occurred_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error('Error inserting visit:', insertError);
    }

    // Get today's date (YYYY-MM-DD format)
    const today = new Date().toISOString().split('T')[0];

    // Upsert into analytics_daily_summary
    const { data: existing } = await supabase
      .from('analytics_daily_summary')
      .select('*')
      .eq('date', today)
      .single();

    if (existing) {
      // Update existing record
      await supabase
        .from('analytics_daily_summary')
        .update({
          total_visits: existing.total_visits + 1,
          bounced_visits: existing.bounced_visits + 1,
        })
        .eq('date', today);
    } else {
      // Create new record
      await supabase
        .from('analytics_daily_summary')
        .insert({
          date: today,
          total_visits: 1,
          bounced_visits: 1,
          total_leads: 0,
          converted_leads: 0,
        });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Error tracking visit:', error);
    // Don't fail loudly - analytics shouldn't break the user experience
    return NextResponse.json({ success: false }, { status: 200 });
  }
}



