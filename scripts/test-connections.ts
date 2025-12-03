/**
 * Test script to verify external service connections
 * Run with: tsx scripts/test-connections.ts
 */

import 'dotenv/config';
import OpenAI from 'openai';
import { Telegraf } from 'telegraf';

async function testOpenAI() {
  console.log('🔍 Testing OpenAI connection...');
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY not found in environment');
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: 'Say "Hello" if you can read this.' }],
      max_tokens: 10,
    });

    console.log('✅ OpenAI connection successful!');
    console.log(`   Response: ${response.choices[0]?.message?.content}`);
    return true;
  } catch (error: any) {
    console.error('❌ OpenAI connection failed:', error.message);
    return false;
  }
}

async function testTelegram() {
  console.log('\n🔍 Testing Telegram bot connection...');
  try {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error('TELEGRAM_BOT_TOKEN not found in environment');
    }

    const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
    const me = await bot.telegram.getMe();

    console.log('✅ Telegram bot connection successful!');
    console.log(`   Bot username: @${me.username}`);
    console.log(`   Bot ID: ${me.id}`);
    return true;
  } catch (error: any) {
    console.error('❌ Telegram bot connection failed:', error.message);
    return false;
  }
}

async function testUpstash() {
  console.log('\n🔍 Testing Upstash Redis connection...');
  try {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      console.warn('⚠️  Upstash Redis credentials not fully configured');
      console.warn('   UPSTASH_REDIS_REST_URL:', process.env.UPSTASH_REDIS_REST_URL ? '✅ Set' : '❌ Missing');
      console.warn('   UPSTASH_REDIS_REST_TOKEN:', process.env.UPSTASH_REDIS_REST_TOKEN ? '✅ Set' : '❌ Missing');
      return false;
    }

    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // Test connection
    await redis.ping();
    console.log('✅ Upstash Redis connection successful!');
    return true;
  } catch (error: any) {
    console.error('❌ Upstash Redis connection failed:', error.message);
    return false;
  }
}

async function main() {
  console.log('🚀 Testing external service connections...\n');

  const results = {
    openai: await testOpenAI(),
    telegram: await testTelegram(),
    upstash: await testUpstash(),
  };

  console.log('\n📊 Summary:');
  console.log(`   OpenAI: ${results.openai ? '✅' : '❌'}`);
  console.log(`   Telegram: ${results.telegram ? '✅' : '❌'}`);
  console.log(`   Upstash: ${results.upstash ? '✅' : '⚠️  (URL needed)'}`);

  const allPassed = results.openai && results.telegram;
  if (allPassed) {
    console.log('\n✅ All critical connections working!');
  } else {
    console.log('\n⚠️  Some connections failed. Please check your environment variables.');
  }

  process.exit(allPassed ? 0 : 1);
}

main().catch(console.error);





