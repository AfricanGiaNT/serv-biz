import { PrismaClient } from '../lib/generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create default settings
  await prisma.settings.upsert({
    where: { key: 'business_name' },
    update: {},
    create: {
      key: 'business_name',
      value: 'PipeWorks',
    },
  });

  await prisma.settings.upsert({
    where: { key: 'service_area' },
    update: {},
    create: {
      key: 'service_area',
      value: 'Johannesburg',
    },
  });

  await prisma.settings.upsert({
    where: { key: 'telegram_user_id' },
    update: {},
    create: {
      key: 'telegram_user_id',
      value: process.env.TELEGRAM_USER_ID || '',
    },
  });

  console.log('✅ Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

