# Upstash Redis Setup

## Getting Your Redis REST URL

You have the Upstash Redis REST Token, but we also need the REST URL.

### Steps to Get REST URL:

1. Go to [Upstash Console](https://console.upstash.com/)
2. Select your Redis database
3. Go to the "REST API" tab
4. Copy the **UPSTASH_REDIS_REST_URL** (should look like: `https://xxxxx.upstash.io`)
5. Copy the **UPSTASH_REDIS_REST_TOKEN** (you already have this: `d7c2b9c1-cf54-4324-8d71-2209f6cfcb3b`)

### Update .env

Once you have the REST URL, update your `.env` file:

```env
UPSTASH_REDIS_REST_URL="https://xxxxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="d7c2b9c1-cf54-4324-8d71-2209f6cfcb3b"
```

### Test Connection

After updating, test the connection:

```bash
npm run test:connections
```

The Upstash Redis connection should now show ✅.

## What Upstash Redis is Used For

- **Rate Limiting**: Prevent abuse of the chat API (15 messages per conversation)
- **Session Management**: Track active conversations
- **Caching**: Cache frequently accessed data

## Free Tier Limits

Upstash free tier includes:
- 10,000 commands per day
- 256 MB storage
- Global replication

This should be sufficient for the MVP.





