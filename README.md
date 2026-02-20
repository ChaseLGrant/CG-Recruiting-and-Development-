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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

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

### Step 1: Delete Old Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on the project showing the 404 error
3. Go to **Settings** → scroll to the bottom → **Delete Project**
4. Confirm deletion

### Step 2: Create New Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → click **Add New...** → **Project**
2. Under **Import Git Repository**, find and select: **`CG-Recruiting-and-Development-`**
   - ⚠️ Make sure it says **`CG-Recruiting-and-Development-`** (with hyphens and "and")
   - **NOT** `CG_Recruiting-Development-` (underscores, no "and") — that repo only has a README!
   - If you don't see it, click **Adjust GitHub App Permissions** and grant access
3. Configure the project:
   - **Framework Preset**: should auto-detect as **Next.js** ✓
   - **Root Directory**: leave as `./` (default) ✓
   - **Build Command**: leave as default ✓
   - **Node.js Version**: `20.x` ✓
4. Under **Environment Variables**, add (optional — app works without these but auth will be disabled):
   - `NEXT_PUBLIC_SUPABASE_URL` = your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = your Supabase anon key
5. Click **Deploy**

### Step 3: Verify Deployment

After the build completes (usually 1-2 minutes):

1. Vercel will show a "Congratulations!" page with your deployment URL
2. Click the URL or visit `https://your-project-name.vercel.app`
3. You should see the Summer Ball Portal homepage
4. Also test: `https://your-project-name.vercel.app/api/health` — should return `{"status":"ok"}`

### Troubleshooting

| Problem | Solution |
|---------|----------|
| **404: NOT_FOUND** with Vercel error ID | Vercel is connected to the wrong repo. Delete the project and re-import **`CG-Recruiting-and-Development-`** (with hyphens) |
| **Main branch "only has a README"** | You're looking at the wrong repo. The correct repo is **`CG-Recruiting-and-Development-`** which has the full app code |
| **Build fails** | Check the build logs in Vercel Dashboard → Deployments → click the failed deployment |
| **Page loads but auth doesn't work** | Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Vercel → Settings → Environment Variables, then redeploy |

### Production Branch

Make sure Vercel is set to deploy from the **`main`** branch:
- Vercel Dashboard → Project → Settings → Git → **Production Branch** should be `main`

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
