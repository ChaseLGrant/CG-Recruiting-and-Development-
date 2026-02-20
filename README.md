This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Connect to Supabase (Backend Setup)

The app uses [Supabase](https://supabase.com) for authentication, database, and row-level security. Follow these steps to set up the backend:

### Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in (or create a free account)
2. Click **New Project**
3. Choose your organization, give it a name (e.g. `summer-ball-portal`), set a database password, and select a region
4. Click **Create new project** — wait ~2 minutes for it to provision

### Step 2: Run the Database Schema

1. In your Supabase project dashboard, go to **SQL Editor** (left sidebar)
2. Click **New query**
3. Copy the **entire contents** of [`supabase/schema.sql`](supabase/schema.sql) from this repo and paste it into the editor
4. Click **Run** (or press Ctrl+Enter)
5. You should see "Success. No rows returned" — this means the tables, indexes, RLS policies, and trigger were all created

The schema creates these tables:
| Table | Purpose |
|-------|---------|
| `profiles` | User profiles (auto-created on signup via trigger) |
| `programs` | College programs managed by coaches |
| `players` | Player profiles with stats, availability, contact info |
| `teams` | Summer teams/leagues |
| `listings` | Open roster spots posted by teams |
| `inquiries` | Messages between users |

### Step 3: Get Your API Keys

1. In Supabase dashboard, go to **Settings** → **API** (under Configuration)
2. You'll see two values you need:
   - **Project URL** — looks like `https://abcdefghijkl.supabase.co`
   - **anon public** key — a long `eyJ...` string (under "Project API keys")

### Step 4: Configure Environment Variables

#### For local development:

Create a `.env.local` file in the project root:

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in your values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...your-anon-key
```

#### For Vercel (production):

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → your project → **Settings** → **Environment Variables**
2. Add these two variables:
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
3. Click **Save**
4. Go to **Deployments** → click the **...** menu on the latest deployment → **Redeploy**

### Step 5: Configure Auth Callback URL

1. In Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Set **Site URL** to your Vercel deployment URL (e.g. `https://your-project.vercel.app`)
3. Under **Redirect URLs**, add:
   - `https://your-project.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local dev)
4. Click **Save**

### Step 6: Verify Everything Works

1. Visit `https://your-project.vercel.app/api/health`
2. You should see a JSON response like:
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
3. Try signing up at `https://your-project.vercel.app/auth/signup`
4. After signup, you should be redirected to your role's dashboard

### Troubleshooting Supabase Connection

| Problem | Solution |
|---------|----------|
| `"configured": false` | Environment variables not set. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel → Settings → Environment Variables, then redeploy |
| `"connected": false` | Check that your Supabase project URL and anon key are correct (no trailing spaces/newlines) |
| `"schemaReady": false` | Database tables not created. Go to Supabase → SQL Editor and run the contents of `supabase/schema.sql` |
| Signup works but no profile created | The `handle_new_user` trigger wasn't created. Re-run `supabase/schema.sql` |
| "Invalid login credentials" | User doesn't exist, or email not confirmed. Check Supabase → Authentication → Users |
| Auth callback redirect fails | Add your domain to Supabase → Authentication → URL Configuration → Redirect URLs |

## Deploy on Vercel

### ⚠️ IMPORTANT: You Have Multiple Repos With Similar Names!

Your GitHub account has several repos with similar names. **Vercel must be connected to the correct one**:

| Repository | Has App Code? | Use This? |
|---|---|---|
| **`CG-Recruiting-and-Development-`** | ✅ Yes — full Next.js app | ✅ **USE THIS ONE** |
| `CG_Recruiting-Development-` | ❌ Only has a README | ❌ Wrong repo |
| `CG3-Recruiting-and-Development-` | ❌ Empty | ❌ Wrong repo |
| `cg_3-recruiting-and-development-` | ❌ Empty | ❌ Wrong repo |

The correct repository is: **`ChaseLGrant/CG-Recruiting-and-Development-`** (note: hyphens not underscores, "and" included, trailing hyphen)

### Vercel Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → click **Add New...** → **Project**
2. Import: **`CG-Recruiting-and-Development-`**
3. Framework Preset: **Next.js** ✓
4. Add environment variables (see Step 4 above)
5. Click **Deploy**

### Production Branch

Make sure Vercel is set to deploy from the **`main`** branch:
- Vercel Dashboard → Project → Settings → Git → **Production Branch** should be `main`

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
