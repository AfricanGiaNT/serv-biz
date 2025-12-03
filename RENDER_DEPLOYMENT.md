# Render Deployment Guide

This project is configured for deployment on Render instead of Vercel.

## Prerequisites

1. Render account (sign up at https://render.com)
2. GitHub repository connected to Render
3. All environment variables configured

## Deployment Steps

### 1. Create a New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Select the repository and branch

### 2. Configure Build Settings

**Build Command:**
```bash
npm install && npx prisma generate && npm run build
```

**Start Command:**
```bash
npm start
```

**Environment:**
- Node: 20 (or latest LTS)

### 3. Set Environment Variables

Add all environment variables from `.env.example`:

```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
TELEGRAM_BOT_TOKEN=...
TELEGRAM_USER_ID=...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
CRON_SECRET=...
NEXT_PUBLIC_APP_URL=https://your-app.onrender.com
```

### 4. Database Migrations

After first deployment, run migrations:

1. Go to Render Shell (in your service dashboard)
2. Run: `npx prisma migrate deploy`
3. (Optional) Run: `npm run prisma:seed`

### 5. Cron Jobs Setup

For automated follow-ups and stats calculation, set up Render Cron Jobs:

1. Go to "Cron Jobs" in Render dashboard
2. Create new cron job with:
   - **Schedule**: `*/15 * * * *` (every 15 minutes for follow-ups)
   - **Command**: `curl https://your-app.onrender.com/api/cron/follow-ups?secret=YOUR_CRON_SECRET`
3. Create another cron for daily stats:
   - **Schedule**: `0 1 * * *` (daily at 1 AM)
   - **Command**: `curl https://your-app.onrender.com/api/cron/calculate-stats?secret=YOUR_CRON_SECRET`

### 6. Custom Domain (Optional)

1. Go to your service settings
2. Add custom domain: `pipeworks.co.za`
3. Update DNS records as instructed by Render
4. Update `NEXT_PUBLIC_APP_URL` environment variable

## Differences from Vercel

- **Cron Jobs**: Use Render Cron Jobs instead of `vercel.json`
- **Environment Variables**: Set in Render dashboard instead of Vercel
- **Build Time**: May be slightly longer on Render
- **Cold Starts**: Render has cold starts on free tier

## Troubleshooting

### Build Fails

- Check Node version (should be 20+)
- Verify all environment variables are set
- Check build logs for specific errors

### Database Connection Issues

- Verify `DATABASE_URL` is correct
- Check if Supabase database is active (not paused)
- Ensure SSL mode is set: `?sslmode=require`

### Cron Jobs Not Running

- Verify `CRON_SECRET` matches in environment and cron job URL
- Check cron job logs in Render dashboard
- Ensure cron job URLs are accessible (not blocked by auth)

## Post-Deployment Checklist

- [ ] Service is running and accessible
- [ ] Database migrations applied
- [ ] Environment variables configured
- [ ] Cron jobs set up and running
- [ ] Telegram webhook configured (update webhook URL)
- [ ] Test chatbot on live site
- [ ] Test lead creation
- [ ] Verify Telegram notifications working





