# Database Setup Instructions

## Current Status

✅ Database connection string configured in `.env`
✅ Prisma schema ready
⏳ Waiting for database connection (database may be paused)

## Connection String

The database connection string has been set in `.env`:
```
DATABASE_URL="postgresql://postgres:CUHX6hrkVUGCYqrp@db.fxkyvmnkfkvibptjdata.supabase.co:5432/postgres?sslmode=require"
```

## Next Steps

### 1. Wake Up Supabase Database (if paused)

If your Supabase database is on the free tier, it may be paused after inactivity:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. If the database shows as "Paused", click "Restore" or "Resume"
4. Wait 1-2 minutes for the database to become active

### 2. Run Database Migration

Once the database is active, run:

```bash
npx prisma db push
```

This will create all the tables in your Supabase database.

### 3. Generate Prisma Client (if needed)

```bash
npx prisma generate
```

### 4. Test Database Connection

```bash
npx prisma studio
```

This will open Prisma Studio in your browser where you can view and manage your database.

### 5. Seed the Database (Optional)

```bash
npm run prisma:seed
```

This will create default settings in your database.

## Troubleshooting

### Connection Error: "Can't reach database server"

**Possible causes:**
1. **Database is paused** - Most common with Supabase free tier
   - Solution: Go to Supabase dashboard and restore/resume the database

2. **Network/Firewall issues**
   - Solution: Check if you can access Supabase dashboard. If not, check your network connection.

3. **Incorrect connection string**
   - Solution: Verify the connection string in Supabase dashboard → Settings → Database → Connection string

4. **SSL requirement**
   - Solution: Make sure `?sslmode=require` is in your connection string (already added)

### Alternative: Use Connection Pooler

If direct connection fails, try using Supabase's connection pooler:

1. Go to Supabase Dashboard → Settings → Database
2. Find "Connection Pooling" section
3. Copy the "Connection string" (Transaction mode)
4. Update `.env` with the pooler URL (port 6543)

## Verification

After successful connection, you should see:
- ✅ All tables created (leads, conversations, messages, settings, daily_stats, ai_usage_stats)
- ✅ Prisma Studio opens successfully
- ✅ No connection errors

## Schema Overview

The following tables will be created:

- **leads** - Customer leads with status, urgency, and contact info
- **conversations** - Chat conversations linked to leads
- **messages** - Individual messages in conversations
- **settings** - Application configuration
- **daily_stats** - Daily analytics
- **ai_usage_stats** - AI cost tracking

See `prisma/schema.prisma` for complete schema definition.

