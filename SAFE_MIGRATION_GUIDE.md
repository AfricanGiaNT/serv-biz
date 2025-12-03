# Safe Database Migration Guide

## What Happened

When attempting `npx prisma db push`, you encountered warnings about:
1. Removing `CHATBOT` from the `LeadSource` enum (would break existing data)
2. Dropping critical tables like `users`, `admin_users`, `sessions`, `analytics_*` (data loss)

## Why It Happened

The initial schema included `schemas = ["public", "auth"]` which told Prisma to manage both schemas. This caused Prisma to try to:
- Drop Supabase Auth tables (which it shouldn't manage)
- Drop analytics tables (which Supabase manages)
- Remove enum values still in use

## The Fix Applied

### 1. Removed Multi-Schema Configuration
```prisma
// BEFORE (DANGEROUS)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  schemas  = ["public", "auth"]  // ❌ This causes Prisma to manage auth tables
}

// AFTER (SAFE)
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")  // ✅ Only manages public schema tables
}
```

### 2. Kept CHATBOT for Backward Compatibility
```prisma
enum LeadSource {
  CHATBOT          // ✅ Keep for existing data
  WEBSITE_CHAT     // New value
  CONTACT_FORM     // Existing
  SERVICES_QUOTE   // New value
  TELEGRAM         // Existing
  MANUAL           // New value
}
```

### 3. Removed All `@@schema("public")` Attributes
Since we're not using multi-schema, these attributes were causing validation errors.

## Safe Migration Steps

### Step 1: Verify Current Schema
```bash
cd /Users/trevorchimtengo/Serv-buz
npx prisma generate  # ✅ Should complete successfully
```

### Step 2: Preview Changes
```bash
npx prisma db push --preview-feature
```

This should now show **ONLY** these safe changes:
- ✅ Adding `serviceType` column to `leads` table (nullable)
- ✅ Adding `attachmentUrl` column to `leads` table (nullable)
- ✅ Adding `WEBSITE_CHAT`, `SERVICES_QUOTE`, `MANUAL` to `LeadSource` enum
- ✅ Adding `source` index to `leads` table

**It should NOT show**:
- ❌ Dropping any tables
- ❌ Removing `CHATBOT` from enum
- ❌ Any changes to auth schema tables

### Step 3: Apply Migration
If the preview looks correct:
```bash
npx prisma db push
```

Answer `y` when prompted (it should be safe now).

## Data Migration Plan

### Phase 1: Add New Enum Values (Safe - Done Above)
```sql
-- This happens automatically with prisma db push
ALTER TYPE "LeadSource" ADD VALUE IF NOT EXISTS 'WEBSITE_CHAT';
ALTER TYPE "LeadSource" ADD VALUE IF NOT EXISTS 'SERVICES_QUOTE';
ALTER TYPE "LeadSource" ADD VALUE IF NOT EXISTS 'MANUAL';
```

### Phase 2: Migrate Existing CHATBOT Data (Optional)
If you want to update existing `CHATBOT` leads to `WEBSITE_CHAT`:

```sql
-- Update existing CHATBOT leads to WEBSITE_CHAT
UPDATE leads 
SET source = 'WEBSITE_CHAT' 
WHERE source = 'CHATBOT';
```

**Note**: Only do this AFTER confirming all application code is deployed and working with the new enum values.

### Phase 3: Remove CHATBOT Enum Value (Future)
After confirming no data uses `CHATBOT`, you can remove it:

1. Verify no data uses it:
```sql
SELECT COUNT(*) FROM leads WHERE source = 'CHATBOT';
-- Should return 0
```

2. Remove from schema and run migration again.

## Verification Checklist

After running `npx prisma db push`:

- [ ] Check that `leads` table has new columns:
```sql
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'leads' 
AND column_name IN ('serviceType', 'attachmentUrl');
```

- [ ] Verify enum values:
```sql
SELECT unnest(enum_range(NULL::public."LeadSource"))::text AS enum_value;
```

Should show: CHATBOT, WEBSITE_CHAT, CONTACT_FORM, SERVICES_QUOTE, TELEGRAM, MANUAL

- [ ] Check existing leads still accessible:
```sql
SELECT COUNT(*), source FROM leads GROUP BY source;
```

- [ ] Test new lead creation with quotation form

## Rollback Plan

If anything goes wrong:

1. **Application code**: Already backward compatible (handles both `CHATBOT` and `WEBSITE_CHAT`)
2. **Database**: New columns are nullable, so old code still works
3. **Quick fix**: Revert Prisma schema and re-generate client

## Production Deployment Order

1. ✅ **Database migration** (what we're doing now)
   - Adds new fields and enum values
   - Does NOT remove anything
   - Backward compatible

2. ✅ **Deploy application code** (already done)
   - Code handles both old and new enum values
   - New features available via new enum values
   - Old code paths still work

3. 🔄 **Monitor** (after deployment)
   - Check Telegram notifications format
   - Verify quotation requests come through correctly
   - Monitor admin dashboard

4. 🔜 **Data cleanup** (weeks later, optional)
   - Migrate CHATBOT → WEBSITE_CHAT if desired
   - Remove CHATBOT from enum once confirmed unused

## Common Issues & Solutions

### Issue: "enum value already exists"
**Solution**: Safe to ignore, Prisma handles this gracefully.

### Issue: "relation ... does not exist"
**Solution**: This shouldn't happen with the fixed schema. If it does, check that you're connected to the right database.

### Issue: Connection timeout
**Solution**: 
```bash
# Check connection
npx prisma db pull
# Should see your current schema
```

### Issue: Still seeing drop table warnings
**Solution**: Verify you've:
1. Removed `schemas = ["public", "auth"]` from datasource
2. Removed all `@@schema("public")` attributes
3. Run `npx prisma generate` again

## Success Criteria

Migration is successful when:
- ✅ No errors during `prisma db push`
- ✅ New columns exist in database
- ✅ New enum values available
- ✅ Existing leads still load in application
- ✅ New quotation requests work end-to-end
- ✅ Admin dashboard shows all metrics correctly
- ✅ Telegram notifications include source and service type

## Current Status

- ✅ Schema fixed (removed multi-schema, kept CHATBOT)
- ✅ Prisma client regenerated successfully
- ⏳ Ready for `npx prisma db push`
- ⏳ Awaiting user confirmation to proceed

## Next Steps

Run this command and review the changes preview:
```bash
npx prisma db push
```

If the preview shows only the safe changes listed above, answer `y` to proceed.

