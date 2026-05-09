# Painkiller SaaS MVP

Painkiller is a mobile-first SaaS for tradespeople to generate, send, and track professional customer quotes in under 2 minutes.

## 10 Local Business SaaS Ideas (Ranked)

Scores: Build Ease / Sales Speed / Money Potential (10 = best)

1. Trades Painkiller (instant branded quotes): 9 / 10 / 9
2. Cleaner Rebooking Engine (auto follow-up and recurring slots): 8 / 9 / 8
3. Barber No-Show Recovery (deposits plus reminder automation): 8 / 9 / 8
4. Roofer Photo-to-Quote Intake (job details to quote draft): 7 / 8 / 9
5. Tutor Session Pack Billing (track packs and auto reminders): 8 / 8 / 7
6. Mobile Car Wash Route Optimizer (zone batching and ETAs): 6 / 7 / 8
7. Mechanic Approval Workflow (parts/labour approval by link): 7 / 8 / 8
8. Beautician Consent and Aftercare Vault: 7 / 7 / 7
9. Landscaper Seasonal Upsell Bot (seasonal service nudges): 8 / 7 / 7
10. Decorator Variation Order Manager: 6 / 7 / 8

## Best Idea Pick

- Product name: Painkiller
- Target users: Plumbers, roofers, electricians, decorators, and similar trades
- Exact pain point: Quoting is slow, messy, and inconsistent while owners are on jobs and on phones
- Why they would pay: Faster quote turnaround wins jobs and reduces admin back-and-forth
- Monetization: Subscription SaaS

## MVP Features

- Account registration and login
- Create branded quotes quickly from phone
- Support labour, materials, VAT, discounts, notes, expiry date
- Save customer details and previous quotes
- Send by email or shareable public link
- Track status: draft, sent, accepted, rejected
- Export quote as PDF
- Mobile-first dashboard

## Future Premium Features

- Templates per trade
- Auto-reminders for expiring quotes
- Team accounts and roles
- Stripe deposit request and payment links
- WhatsApp send integration
- Advanced analytics: win-rate, cycle time, quote value by source

## Pricing Model

- Starter: GBP 19/month (single user, 75 quotes)
- Pro: GBP 39/month (unlimited quotes, reminders, branding)
- Team: GBP 79/month (multi-user and permissions)

## Landing Page Positioning

- Headline: Send polished quotes before your competitor calls back.
- Value proposition: Create, send, and track professional trades quotes from your phone in under two minutes.

## First 10 Customers Plan

1. Direct outreach to local trades Facebook groups with short demo video
2. Cold DM 30 local trades owners on Instagram/Google Maps
3. Offer first month free for feedback calls
4. Build 3 niche templates (plumber, roofer, electrician)
5. Ask accepted users for referrals in exchange for discount
6. Post before/after workflow clips on TikTok and Reels
7. Partner with one local bookkeeping firm for referrals
8. Add simple affiliate code for early users
9. Send LinkedIn messages to solo trades in one city
10. Run a hyper-local Google Search ad on "quote template tradesman"

## Stack

- Frontend: Next.js 16 App Router + TypeScript + Tailwind CSS
- Backend: Next.js Route Handlers
- Auth: NextAuth credentials provider
- Database: PostgreSQL + Prisma ORM
- Validation: Zod
- Forms: React Hook Form
- PDF: pdf-lib
- Email: Nodemailer (SMTP)

## Database Schema

Core models in `prisma/schema.prisma`:

- `User`: account and business branding fields
- `Customer`: saved customer records
- `Quote`: quote metadata, totals, status, public token
- `QuoteLineItem`: labour/material/other rows
- Enums: `QuoteStatus`, `LineItemType`

## API Routes

- `POST /api/register`
- `GET /api/quotes`
- `POST /api/quotes`
- `GET /api/quotes/:id`
- `PATCH /api/quotes/:id`
- `POST /api/quotes/:id/send`
- `GET /api/quotes/:id/pdf`
- `POST /api/public/quotes/:token/status`
- `GET|POST /api/auth/[...nextauth]`

## Folder Structure

```
src/
	app/
		api/
		dashboard/
		login/
		q/[token]/
		register/
	components/
		new-quote-form.tsx
		quote-actions.tsx
		sign-out-button.tsx
	lib/
		api.ts
		auth.ts
		mailer.ts
		pdf.ts
		prisma.ts
		utils.ts
		validators.ts
	types/
		next-auth.d.ts
prisma/
	schema.prisma
```

## Deployment Plan

1. Create PostgreSQL database (Neon, Supabase, or Railway)
2. Set env vars in host platform:
	 - `DATABASE_URL`
	 - `NEXTAUTH_SECRET`
	 - `NEXTAUTH_URL`
	 - `APP_BASE_URL`
	 - SMTP vars for email sending
3. Run migrations in CI/CD:
	 - `npx prisma migrate deploy`
4. Deploy on Vercel (or Render/Fly with Node runtime)
5. Configure custom domain and transactional email sender

## Local Setup

1. Copy `.env.example` to `.env` and fill values
2. Install dependencies:

```bash
npm install
```

3. Generate Prisma client:

```bash
npx prisma generate
```

4. Create database tables:

```bash
npx prisma migrate dev --name init
```

5. Run app:

```bash
npm run dev
```

## Build Status

- `npm run lint`: passes
- `npm run build`: passes

## Notes

- Workspace root folder name contains spaces and uppercase letters, so the app is created in `quoteflow-saas/`.
