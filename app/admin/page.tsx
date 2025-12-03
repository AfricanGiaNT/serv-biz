import { prisma } from '@/lib/prisma';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createSupabaseServerClient } from '@/lib/supabase';
import { LogoutButton } from '@/components/LogoutButton';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

async function getAnalyticsData(period: 'today' | 'week' | 'month') {
  const now = new Date();
  let startDate: Date;

  switch (period) {
    case 'today':
      startDate = new Date(now);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'week':
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
      startDate.setHours(0, 0, 0, 0);
      break;
    case 'month':
      startDate = new Date(now);
      startDate.setMonth(now.getMonth() - 1);
      startDate.setHours(0, 0, 0, 0);
      break;
    default:
      startDate = new Date(now);
      startDate.setDate(now.getDate() - 7);
  }

  const startDateStr = startDate.toISOString().split('T')[0];
  const nowStr = now.toISOString().split('T')[0];

  // Get stats from Supabase analytics_daily_summary
  const supabase = createSupabaseServerClient();
  
  const { data: stats, error } = await supabase
    .from('analytics_daily_summary')
    .select('*')
    .gte('date', startDateStr)
    .lte('date', nowStr)
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching analytics from Supabase:', error);
  }

  // Aggregate totals from Supabase
  const totalVisits = stats?.reduce((sum, s) => sum + s.total_visits, 0) || 0;
  const bouncedVisits = stats?.reduce((sum, s) => sum + s.bounced_visits, 0) || 0;
  const totalLeads = stats?.reduce((sum, s) => sum + s.total_leads, 0) || 0;
  const convertedLeads = stats?.reduce((sum, s) => sum + s.converted_leads, 0) || 0;
  
  // Calculate bounce rate
  const bounceRate = totalVisits > 0 ? ((bouncedVisits / totalVisits) * 100).toFixed(1) : '0.0';
  
  // Calculate conversion rate
  const conversionRate = totalLeads > 0 ? ((convertedLeads / totalLeads) * 100).toFixed(1) : '0.0';

  // Get lead breakdown from Prisma (still using Prisma for detailed lead data)
  const leads = await prisma.lead.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lte: now,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const leadsBySource = {
    WEBSITE_CHAT: leads.filter(l => l.source === 'WEBSITE_CHAT' || l.source === 'CHATBOT').length,
    CONTACT_FORM: leads.filter(l => l.source === 'CONTACT_FORM').length,
    SERVICES_QUOTE: leads.filter(l => l.source === 'SERVICES_QUOTE').length,
    TELEGRAM: leads.filter(l => l.source === 'TELEGRAM').length,
    MANUAL: leads.filter(l => l.source === 'MANUAL').length,
  };

  const leadsByStatus = {
    NEW: leads.filter(l => l.status === 'NEW').length,
    CONTACTED: leads.filter(l => l.status === 'CONTACTED').length,
    QUOTED: leads.filter(l => l.status === 'QUOTED').length,
    CONVERTED: leads.filter(l => l.status === 'CONVERTED').length,
    LOST: leads.filter(l => l.status === 'LOST').length,
    OUT_OF_AREA: leads.filter(l => l.status === 'OUT_OF_AREA').length,
  };

  return {
    totalVisits,
    bouncedVisits,
    bounceRate,
    totalLeads,
    convertedLeads,
    conversionRate,
    leadsBySource,
    leadsByStatus,
    dailyBreakdown: stats?.map(s => ({
      id: s.id,
      date: s.date,
      totalVisits: s.total_visits,
      bouncedVisits: s.bounced_visits,
      totalLeads: s.total_leads,
      convertedLeads: s.converted_leads,
    })) || [],
  };
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: { period?: string };
}) {
  // Check auth using Supabase
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  // Check if user is an admin
  const { data: adminData, error } = await supabase
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .eq('role', 'admin')
    .single();

  if (error || !adminData) {
    redirect('/admin/login');
  }

  const period = (searchParams.period as 'today' | 'week' | 'month') || 'week';
  const data = await getAnalyticsData(period);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your website performance and lead metrics
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Logged in as: {user.email}
          </p>
        </div>
        <LogoutButton />
      </div>

      {/* Period Selector */}
      <div className="flex gap-2 mb-6">
        <a
          href="?period=today"
          className={`px-4 py-2 rounded-md ${
            period === 'today'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary hover:bg-secondary/80'
          }`}
        >
          Today
        </a>
        <a
          href="?period=week"
          className={`px-4 py-2 rounded-md ${
            period === 'week'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary hover:bg-secondary/80'
          }`}
        >
          Last 7 Days
        </a>
        <a
          href="?period=month"
          className={`px-4 py-2 rounded-md ${
            period === 'month'
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary hover:bg-secondary/80'
          }`}
        >
          Last 30 Days
        </a>
      </div>

      {/* PRIMARY SECTION: Leads by Status (TOP PRIORITY) */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Leads by Status</CardTitle>
          <CardDescription>Lead pipeline overview - your main focus</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-700">{data.leadsByStatus.NEW}</div>
              <div className="text-sm text-muted-foreground mt-1">New</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-700">{data.leadsByStatus.CONTACTED}</div>
              <div className="text-sm text-muted-foreground mt-1">Contacted</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-700">{data.leadsByStatus.QUOTED}</div>
              <div className="text-sm text-muted-foreground mt-1">Quoted</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-700">{data.leadsByStatus.CONVERTED}</div>
              <div className="text-sm text-muted-foreground mt-1">Converted</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-700">{data.leadsByStatus.LOST}</div>
              <div className="text-sm text-muted-foreground mt-1">Lost</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-700">{data.leadsByStatus.OUT_OF_AREA}</div>
              <div className="text-sm text-muted-foreground mt-1">Out of Area</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECONDARY SECTION: Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Visits
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalVisits}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Page views • {data.bounceRate}% bounce rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Requests (Leads)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Contact requests received
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Bookings (Converted)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.convertedLeads}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {data.conversionRate}% conversion rate
            </p>
          </CardContent>
        </Card>
      </div>

      {/* TERTIARY SECTION: Lead Sources */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Leads by Source</CardTitle>
          <CardDescription>Where your leads are coming from</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-bold">{data.leadsBySource.WEBSITE_CHAT}</div>
              <div className="text-xs text-muted-foreground mt-1">Website Chat</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-bold">{data.leadsBySource.CONTACT_FORM}</div>
              <div className="text-xs text-muted-foreground mt-1">Contact Form</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-bold">{data.leadsBySource.SERVICES_QUOTE}</div>
              <div className="text-xs text-muted-foreground mt-1">Services Quote</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-bold">{data.leadsBySource.TELEGRAM}</div>
              <div className="text-xs text-muted-foreground mt-1">Telegram</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-xl font-bold">{data.leadsBySource.MANUAL}</div>
              <div className="text-xs text-muted-foreground mt-1">Manual Entry</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Breakdown Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Breakdown</CardTitle>
          <CardDescription>Day-by-day metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Date</th>
                  <th className="text-right p-2">Visits</th>
                  <th className="text-right p-2">Bounced</th>
                  <th className="text-right p-2">Leads</th>
                  <th className="text-right p-2">Converted</th>
                </tr>
              </thead>
              <tbody>
                {data.dailyBreakdown.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center p-4 text-muted-foreground">
                      No data available for selected period
                    </td>
                  </tr>
                ) : (
                  data.dailyBreakdown.map((day) => (
                    <tr key={day.id} className="border-b">
                      <td className="p-2">{new Date(day.date).toLocaleDateString()}</td>
                      <td className="text-right p-2">{day.totalVisits}</td>
                      <td className="text-right p-2">{day.bouncedVisits}</td>
                      <td className="text-right p-2">{day.totalLeads}</td>
                      <td className="text-right p-2">{day.convertedLeads}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



