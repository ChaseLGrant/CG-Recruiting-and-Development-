# Run It — Deployment Guide

> **Run your own games.** — A tournament platform for baseball & softball teams.

---

## Architecture

| Layer | Tech |
|---|---|
| Frontend + API | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Auth + Database | Supabase |
| Payments | Stripe Checkout |
| Hosting | Vercel |

---

## Step 1 — Supabase Setup

### 1.1 Create a Project

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Choose a name, password, and region
3. Wait for provisioning (~2 min)

### 1.2 Run the Schema

1. Open **SQL Editor** in your Supabase dashboard
2. Click **New query**
3. Paste the entire contents of `supabase/schema.sql`
4. Click **Run** (or press `Ctrl+Enter`)

This creates:
- `profiles` — user accounts (extended from Supabase auth)
- `tournaments` — tournament listings
- `tournament_registrations` — team sign-ups with payment status
- Row Level Security policies for all tables

### 1.3 Copy Your Keys

From **Settings → API**:
- `NEXT_PUBLIC_SUPABASE_URL` — Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` — service_role key (**keep secret — for webhook only**)

### 1.4 Disable Email Confirmation (optional for dev)

Go to **Authentication → Providers → Email** → toggle off **Confirm email** for faster local testing.

---

## Step 2 — Stripe Setup

### 2.1 Create a Stripe Account

Go to [stripe.com](https://stripe.com) and create a free account.

### 2.2 Get Your Keys

From **Developers → API Keys**:
- `STRIPE_SECRET_KEY` — Secret key (starts with `sk_test_...` for test mode)
- `STRIPE_PUBLISHABLE_KEY` — Publishable key (starts with `pk_test_...`)

### 2.3 Set Up the Webhook (for payment confirmation)

This step is required for payment status to update after checkout.

#### For local development:

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the **webhook signing secret** (starts with `whsec_...`) — this is your `STRIPE_WEBHOOK_SECRET`.

#### For production (Vercel):

1. Go to **Stripe Dashboard → Developers → Webhooks → Add endpoint**
2. URL: `https://your-app.vercel.app/api/stripe/webhook`
3. Events to listen for:
   - `checkout.session.completed`
   - `checkout.session.expired`
4. Copy the **Signing secret** → set as `STRIPE_WEBHOOK_SECRET`

### 2.4 Platform Fee

The platform automatically takes a **5% fee** on all paid registrations. This is calculated in `src/lib/stripe.ts` and tracked in the metadata of each Stripe session. Manual payouts to hosts can be handled via Stripe Dashboard or upgraded to Stripe Connect for automatic payouts.

---

## Step 3 — Environment Variables

Create a `.env.local` file in the root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_PUBLISHABLE_KEY=pk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# App URL (used for Stripe redirect URLs)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

---

## Step 4 — Local Development

```bash
# Install dependencies
npm install

# Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Step 5 — Deploy to Vercel

### 5.1 Push to GitHub

```bash
git add .
git commit -m "Run It MVP"
git push
```

### 5.2 Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Click **Deploy** (will fail without env vars — add them next)

### 5.3 Add Environment Variables

In Vercel → **Settings → Environment Variables**, add:

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `STRIPE_SECRET_KEY` | Your Stripe secret key |
| `STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Your Stripe webhook signing secret |
| `NEXT_PUBLIC_SITE_URL` | Your Vercel deployment URL (e.g. `https://run-it.vercel.app`) |

### 5.4 Redeploy

After setting env vars, go to **Deployments → Redeploy**.

### 5.5 Update Stripe Webhook

After deploying, update your Stripe webhook URL to your production Vercel URL:

```
https://your-app.vercel.app/api/stripe/webhook
```

---

## Folder Structure

```
src/
├── app/
│   ├── page.tsx                    # Homepage (Run It landing)
│   ├── layout.tsx                  # Root layout + navbar + footer
│   ├── globals.css                 # Tailwind theme + custom vars
│   │
│   ├── auth/
│   │   ├── login/page.tsx          # Email/password login
│   │   ├── signup/page.tsx         # Sign up (host or team role)
│   │   └── callback/route.ts       # Supabase auth callback
│   │
│   ├── tournaments/
│   │   ├── page.tsx                # Browse tournaments (with filters)
│   │   ├── create/page.tsx         # Create tournament form
│   │   └── [id]/
│   │       ├── page.tsx            # Tournament detail + join
│   │       └── JoinButton.tsx      # Client-side join/pay button
│   │
│   ├── dashboard/
│   │   ├── page.tsx                # Redirects to host or team dashboard
│   │   ├── layout.tsx              # Auth guard
│   │   ├── host/page.tsx           # Host: tournaments, revenue, teams
│   │   └── team/page.tsx           # Team: registrations, payment status
│   │
│   └── api/
│       ├── tournaments/route.ts    # GET/POST tournaments
│       └── stripe/
│           ├── checkout/route.ts   # Create Stripe checkout session
│           └── webhook/route.ts    # Handle Stripe payment events
│
├── components/
│   ├── navbar.tsx                  # Main navigation
│   └── ...                        # Other shared components
│
└── lib/
    ├── stripe.ts                   # Stripe server client + fee helpers
    ├── types.ts                    # TypeScript types (Tournament, etc.)
    ├── supabase-browser.ts         # Browser Supabase client
    └── supabase-server.ts          # Server Supabase client
```

---

## User Flows

### Host creates a tournament (< 5 minutes)

1. Sign up as **Tournament Host**
2. Click **Create Tournament** in the navbar
3. Fill in name, location, date, teams, entry fee, format
4. Submit → get a unique shareable link
5. Share the link → teams can find and join
6. Track registrations and revenue from **Dashboard**

### Team joins a tournament

1. Browse `/tournaments` or open a shared link
2. Click **Join** on the tournament page
3. Enter team name
4. Pay via Stripe Checkout (or join free if $0 fee)
5. Get confirmed on the tournament page with a receipt

---

## Database Tables

### `tournaments`
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| host_id | uuid | References `profiles.id` |
| name | text | Tournament name |
| location | text | City, state, or venue |
| date | date | Tournament date |
| max_teams | int | Maximum number of teams |
| entry_fee | numeric | Per-team entry fee (0 for free) |
| description | text | Optional details |
| format | text | `bracket` or `round_robin` |
| sport | text | `baseball` or `softball` |
| is_active | boolean | Visibility toggle |

### `tournament_registrations`
| Column | Type | Description |
|---|---|---|
| id | uuid | Primary key |
| tournament_id | uuid | References `tournaments.id` |
| user_id | uuid | References `profiles.id` |
| team_name | text | Registered team name |
| payment_status | text | `pending`, `paid`, `free`, `failed` |
| stripe_session_id | text | Stripe checkout session ID |
| amount_paid | numeric | Actual amount paid |

---

## Payments & Fees

- All payments go through **Stripe Checkout**
- Platform fee: **5%** of entry fee (noted in Stripe metadata)
- Free tournaments bypass Stripe entirely
- Webhook at `/api/stripe/webhook` confirms payments and updates `payment_status`
- Host payouts are manual in MVP (via Stripe Dashboard)

### Going live

- Switch Stripe keys from `sk_test_...` to `sk_live_...`
- Update webhook endpoint to production URL
- Enable **real card payments** in Stripe Dashboard

---

## Troubleshooting

| Problem | Fix |
|---|---|
| "Supabase not configured" | Add env vars to `.env.local` or Vercel |
| "Database error saving new user" | Run `schema.sql` in Supabase SQL Editor |
| Payments don't confirm | Check Stripe webhook is running and `STRIPE_WEBHOOK_SECRET` is set |
| Can't see tournament after creating | Check `is_active = true` in Supabase |
| Login redirects to wrong dashboard | Check profile `role` column in Supabase |

---

## Support

Open an issue on GitHub or check `/setup` for in-app diagnostics.
