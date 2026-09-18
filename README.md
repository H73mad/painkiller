# Painkiller — Mobile Quoting Workflow

> A mobile-first quote-to-accept workflow for tradespeople who need to send professional estimates while they are still on the job.

[Live demo](https://quoteflow-saas-rho.vercel.app) · [Source code](https://github.com/H73mad/painkiller)

## The problem

Small trade businesses often create quotes from a phone, under time pressure, while customer details and pricing are spread across messages, notes and spreadsheets. Painkiller turns that fragmented process into one short workflow.

## Core workflow

```text
Customer → line items → VAT / discount → branded quote → send or share → status → acceptance
```

## Product capabilities

- Mobile-first dashboard for customers and quotes
- Labour, materials, VAT, discounts, notes and expiry dates
- Branded quote generation with PDF export
- Email and public-link sharing
- Quote statuses for draft, sent, accepted and rejected
- Customer history and previous-quote context
- Authenticated business workspace and database-backed records

## Stack

- Next.js App Router, React and TypeScript
- PostgreSQL with Prisma ORM
- NextAuth credentials authentication
- Zod and React Hook Form for validation and forms
- pdf-lib for document generation
- Nodemailer for email delivery

## Run locally

```bash
npm install
cp .env.example .env
npx prisma generate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Portfolio focus

Painkiller is less about a flashy dashboard and more about reducing friction in a real operational workflow. It demonstrates requirements thinking, state transitions, transactional data modelling, mobile UX and the design of a clear path from input to customer action.

## Production considerations

A production version would add verified email delivery, stronger account recovery, team permissions, audit history, payment integration and automated reminders for expiring quotes.
