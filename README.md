# Freelancer Tax & Finance Automation Dashboard

Hackathon-ready MVP: invoices, automatic tax estimates on paid work, expenses, and a **Safe to spend** number so freelancers know what cash is left after taxes and spending.

## Stack

- **Next.js** (App Router) + **TypeScript** + **React 19**
- **Tailwind CSS v4** + **shadcn-style** UI primitives (Radix + `class-variance-authority`)
- **Recharts** (income bar chart, expense pie chart)
- **Supabase** (PostgreSQL, Auth, Row Level Security)
- **html2pdf.js** (client-side invoice PDF)
- Server Actions for mutations; **no Redux**

## Prerequisites

- Node.js 20+
- A [Supabase](https://supabase.com) project

## 1. Clone / install

```bash
cd freelancer-tax-dashboard
npm install
```

If `npm install` fails (e.g. cloud sync locking `node_modules`), clone or copy the project to a local non-synced folder and run `npm install` there.

## 2. Environment

Copy `.env.example` to `.env.local` and fill in:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon public key |

Optional (seed script only):

| Variable | Purpose |
|----------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | Service role (server-side only) |
| `SEED_USER_ID` | Your `auth.users` id for demo data |

## 3. Database setup (Supabase SQL Editor)

1. Open **SQL** → **New query**.
2. Paste and run `supabase/schema.sql`.
3. If the trigger fails with a syntax error, replace `execute function` with `execute procedure` for your Postgres version.

This creates:

- `public.users` (profile; `id` = `auth.users.id`)
- `public.invoices` (`Draft` \| `Sent` \| `Paid`)
- `public.expenses`
- Trigger: new auth user → row in `public.users`
- RLS policies so users only see their own rows

## 4. Supabase Auth URLs

In **Authentication → URL configuration**:

- **Site URL**: `http://localhost:3000` (production: your domain)
- **Redirect URLs**: add `http://localhost:3000/auth/callback`

Enable **Email** and **Google** providers. For Google, configure OAuth client ID/secret in Supabase.

## 5. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up or sign in with Google, complete onboarding (target income + tax %), then use the dashboard.

## 6. Seed demo data (optional)

After you have at least one user:

1. Copy the user UUID from **Authentication → Users**.
2. Set `SEED_USER_ID` and service role in `.env.local`.
3. Run:

```bash
npm run seed
```

This inserts **10 invoices** (mix of statuses) and **5 expenses**, and sets profile targets so the dashboard looks full for demos.

## Tax logic (MVP)

For each invoice with `status = 'Paid'`:

```text
tax for that invoice = amount × (estimated_tax_rate / 100)
```

Dashboard:

- **Total income** = sum of paid invoice amounts  
- **Estimated taxes** = sum of per-invoice tax at the profile rate  
- **Safe to spend** = `total_income - total_tax - total_expenses`

Not tax or legal advice—demo math only.

## Project layout

- `app/` — App Router pages, `auth/callback`, server actions (`app/dashboard/actions.ts`)
- `components/ui/` — Button, Card, Input, Table, etc.
- `components/dashboard/` — Metrics, charts, progress
- `components/invoices/` — Form, table, PDF download
- `lib/supabase/` — Browser + server clients
- `lib/tax.ts` — Tax helpers
- `supabase/schema.sql` — DDL + RLS + trigger
- `scripts/seed.mjs` — Demo seed

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | ESLint |
| `npm run seed` | Seed invoices/expenses (requires service role + user id) |

## Demo tips

- Highlight **Safe to spend** and toggling **Mark paid** to show tax and totals update.
- Run the seed script so charts and tables are never empty.
