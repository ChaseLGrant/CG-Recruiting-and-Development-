# Summer Ball Portal

A Next.js app connecting college players with summer baseball opportunities. Uses Supabase for auth and database.

## 🚀 Connect Vercel to Supabase (Do This First!)

You already have the app deployed on Vercel. Now connect it to Supabase so auth, sign-up, and the database work.

**There are 5 steps. The whole thing takes about 10 minutes.**

---

### Step 1 → Create a Supabase project

1. Go to **[supabase.com/dashboard](https://supabase.com/dashboard)** and sign in (or create a free account)
2. Click **New Project**
3. Fill in:
   - **Name**: `summer-ball-portal` (or whatever you want)
   - **Database Password**: pick something strong and save it in a password manager
   - **Region**: pick the one closest to you (e.g. East US)
4. Click **Create new project** — wait ~2 minutes for it to finish setting up

---

### Step 2 → Create the database tables

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open the file [`supabase/schema.sql`](supabase/schema.sql) from this repo — copy **ALL** the contents
4. Paste it into the SQL editor
5. Click **Run** (or Ctrl+Enter)
6. You should see ✅ "Success. No rows returned" — that means all tables were created

> This creates 6 tables: `profiles`, `programs`, `players`, `teams`, `listings`, `inquiries`, plus security policies and an auto-profile trigger.

---

### Step 3 → Copy your Supabase API keys

1. In Supabase dashboard, click **Settings** (gear icon, left sidebar) → **API**
2. You need two values from this page:

| What to copy | Where to find it | Example |
|---|---|---|
| **Project URL** | Under "Project URL" | `https://abcdefghijkl.supabase.co` |
| **anon public key** | Under "Project API keys" → `anon` `public` | `eyJhbGciOiJIUzI1NiIs...` (long string) |

Keep this page open — you'll paste these into Vercel next.

---

### Step 4 → Add the keys to Vercel

1. Go to **[vercel.com/dashboard](https://vercel.com/dashboard)**
2. Click on your **Summer Ball Portal project**
3. Go to **Settings** → **Environment Variables**
4. Add two variables:

| Name (Key) | Value (paste from Supabase) |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Project URL from Step 3 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon public key from Step 3 |

5. Click **Save** for each one
6. Now **redeploy** so the new variables take effect:
   - Go to **Deployments** tab
   - Click the **⋮** menu on the latest deployment → **Redeploy**
   - Wait for it to finish (~1 minute)

---

### Step 5 → Configure auth redirect URLs

1. Go back to **Supabase dashboard** → **Authentication** (left sidebar) → **URL Configuration**
2. Set **Site URL** to your Vercel URL:
   ```
   https://your-project-name.vercel.app
   ```
3. Under **Redirect URLs**, click **Add URL** and add:
   ```
   https://your-project-name.vercel.app/auth/callback
   ```
4. Click **Save**

> Replace `your-project-name` with your actual Vercel project URL (you can find it on the Vercel dashboard).

---

### ✅ Verify it's working

Visit your site's health check: `https://your-project-name.vercel.app/api/health`

You should see:
```json
{
  "status": "ok",
  "supabase": {
    "configured": true,
    "connected": true,
    "schemaReady": true,
    "tables": ["profiles", "programs", "players", "teams", "listings", "inquiries"]
  }
}
```

Then try **signing up** at `https://your-project-name.vercel.app/auth/signup` — pick a role, enter your email and password, and you should land on your dashboard!

> **Note**: By default Supabase requires email confirmation. For testing, you can disable this: Supabase → **Authentication** → **Providers** → **Email** → turn off **Confirm email**. Otherwise check your inbox for the confirmation link.

---

### Troubleshooting

| What you see | What's wrong | Fix |
|---|---|---|
| `"configured": false` | Env vars not set in Vercel | Go to Vercel → Settings → Environment Variables, add both keys, then Redeploy |
| `"connected": false` | Wrong URL or key | Double-check your Supabase URL and anon key — no trailing spaces |
| `"schemaReady": false` | Tables not created | Go to Supabase → SQL Editor → run `supabase/schema.sql` again |
| Signup says "error" | Supabase not connected | Check that env vars are correct and you redeployed after adding them |
| Sign up works but no dashboard data | Trigger missing | Re-run `supabase/schema.sql` — the `handle_new_user` trigger creates profiles on signup |
| Auth redirect fails | Callback URL not added | Add `https://your-site.vercel.app/auth/callback` in Supabase → Auth → URL Configuration |
| Can't log in after signup | Email not confirmed | Check Supabase → Authentication → Users. For testing, you can disable email confirmation in Auth → Providers → Email |

---

## Local Development

```bash
# Install dependencies
npm install

# Copy env file and fill in your Supabase keys
cp .env.local.example .env.local

# Start dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

For local auth to work, also add `http://localhost:3000/auth/callback` to your Supabase redirect URLs (Step 5 above).

## Deploy on Vercel

> **⚠️ You have multiple repos with similar names!** Make sure Vercel is connected to **`CG-Recruiting-and-Development-`** (hyphens, includes "and", trailing hyphen) — NOT `CG_Recruiting-Development-` which only has a README.

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → **Add New...** → **Project**
2. Import: **`CG-Recruiting-and-Development-`**
3. Framework Preset: **Next.js** ✓
4. Add your Supabase env vars (see Step 4 above)
5. Click **Deploy**

Production branch should be **`main`** (Vercel → Settings → Git → Production Branch).
