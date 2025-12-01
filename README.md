# PipeWorks - Service Business Lead Capture AI Follow-Up System

A Next.js application for capturing and managing leads for a plumbing service business using AI chatbot, Telegram notifications, and automated follow-ups.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Supabase) with Prisma ORM
- **AI**: OpenAI (GPT-4o-mini)
- **Notifications**: Telegram Bot (Telegraf)
- **Rate Limiting**: Upstash Redis
- **Deployment**: Render

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/                # API routes
│   │   ├── chat/           # Chat API
│   │   ├── leads/          # Leads API
│   │   └── telegram/       # Telegram webhook
│   ├── components/         # React components
│   └── (routes)/           # Page routes
├── components/             # Shared components
├── lib/                    # Utility functions
│   └── prisma.ts          # Prisma client
├── prisma/                 # Database schema & migrations
│   └── schema.prisma      # Prisma schema
└── config/                 # Configuration files
```

## Getting Started

### Prerequisites

- Node.js 18+ (20+ recommended)
- npm or yarn
- Supabase account (for database)
- OpenAI API key
- Telegram Bot token (from @BotFather)
- Upstash Redis account (for rate limiting)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Serv-buz
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env.local`
   - Fill in all required values:
     - `DATABASE_URL` - Supabase PostgreSQL connection string
     - `OPENAI_API_KEY` - Your OpenAI API key
     - `TELEGRAM_BOT_TOKEN` - Telegram bot token
     - `TELEGRAM_USER_ID` - Your Telegram user ID
     - `UPSTASH_REDIS_REST_URL` - Upstash Redis REST URL
     - `UPSTASH_REDIS_REST_TOKEN` - Upstash Redis REST token
     - `CRON_SECRET` - Secret for cron job authentication

4. **Set up the database**
   ```bash
   # Create initial migration
   npx prisma migrate dev --name init
   
   # Generate Prisma Client
   npx prisma generate
   
   # Seed the database (optional)
   npm run prisma:seed
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following main models:

- **Lead**: Customer leads with status, urgency, and contact info
- **Conversation**: Chat conversations linked to leads
- **Message**: Individual messages in conversations
- **Settings**: Application configuration
- **DailyStats**: Daily analytics
- **AIUsageStats**: AI cost tracking

See `prisma/schema.prisma` for the complete schema.

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations
- `npx prisma generate` - Generate Prisma Client

## Milestones

This project follows an 8-week development plan:

1. ✅ **Milestone 1**: Foundation & Setup (Current)
2. ⬜ **Milestone 2**: Landing Page & Basic UI
3. ⬜ **Milestone 3**: AI Chatbot Implementation
4. ⬜ **Milestone 4**: Telegram Bot Integration
5. ⬜ **Milestone 5**: Contact Form & Follow-ups
6. ⬜ **Milestone 6**: Testing & Bug Fixes
7. ⬜ **Milestone 7**: Deployment & Monitoring
8. ⬜ **Milestone 8**: Documentation & Handoff

See `dev-milestones.md` for detailed milestone breakdown.

## Environment Variables

Required environment variables (see `.env.example`):

```env
DATABASE_URL="postgresql://..."
OPENAI_API_KEY="sk-..."
TELEGRAM_BOT_TOKEN="..."
TELEGRAM_USER_ID="..."
UPSTASH_REDIS_REST_URL="https://..."
UPSTASH_REDIS_REST_TOKEN="..."
CRON_SECRET="..."
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

## License

Private - All rights reserved

