# Deploying Summer Ball Portal to Vercel

## Prerequisites

| Item | Where to get it |
|------|----------------|
| **Supabase project** | [supabase.com/dashboard](https://supabase.com/dashboard) → **New Project** |
| **Vercel account** | [vercel.com](https://vercel.com) (connect to your GitHub repo) |

---

## 1. Get your Supabase API keys

1. Open the **Supabase dashboard** → select your project.
2. Go to **Settings** (gear icon) → **API**.
3. Copy:
   - **Project URL** → this is your `NEXT_PUBLIC_SUPABASE_URL`
     (looks like `https://abcdefghijkl.supabase.co`)
   - **anon public** key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     (long string starting with `eyJ…`)

> ⚠️ **Never** use the `service_role` key in the browser. Only the `anon` key is safe for client-side use.

---

## 2. Add environment variables in Vercel

1. Open [vercel.com/dashboard](https://vercel.com/dashboard) → click your **Summer Ball Portal** project.
2. Click **Settings** → **Environment Variables**.
3. Add each variable:

   | Key | Value | Environments |
   |-----|-------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | _your Project URL_ | ✅ Production, ✅ Preview |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | _your anon public key_ | ✅ Production, ✅ Preview |

4. Click **Save** for each.

---

## 3. Run the database schema

If you haven't already:

1. In Supabase → **SQL Editor** → **New query**.
2. Paste the entire contents of `supabase/schema.sql`.
3. Click **Run**. You should see _"Success. No rows returned."_

---

## 4. Redeploy on Vercel

Environment variables are injected at **build time**, so you must redeploy after adding them:

1. Go to the **Deployments** tab in your Vercel project.
2. Click the **⋮** menu on the latest deployment → **Redeploy**.
3. (Optional) Check **"Clear Build Cache"** if you want a clean build.
4. Wait for the build to complete.

---

## 5. Promote to Production (if needed)

If Vercel deployed to a preview URL instead of your production domain:

1. Go to **Deployments**.
2. Find the successful deployment you want to promote.
3. Click **⋮** → **Promote to Production**.

---

## 6. Configure auth redirect URLs

1. In Supabase → **Authentication** → **URL Configuration**.
2. Set **Site URL** to: `https://your-project.vercel.app`
3. Under **Redirect URLs**, add: `https://your-project.vercel.app/auth/callback`
4. Click **Save**.

---

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase keys
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you should see the homepage with a Supabase status indicator in the footer.

---

## Verification checklist

- [ ] `npm run build` passes locally
- [ ] `npm run dev` → homepage loads, footer shows _"Supabase connected"_ (or _"not configured"_ without env vars)
- [ ] Vercel deployment logs show a successful build
- [ ] Production URL loads the homepage correctly
- [ ] `/api/health` returns `{ "status": "ok" }` when Supabase is configured
