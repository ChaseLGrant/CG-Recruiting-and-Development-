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

### Quick Setup

1. Go to [Vercel Dashboard](https://vercel.com/dashboard) → **Add New Project**
2. **Import** the GitHub repository: `ChaseLGrant/CG-Recruiting-and-Development-`
3. Ensure the following settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
   - **Node.js Version**: 20.x

### Environment Variables

Add these in Vercel → Project Settings → Environment Variables:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous key |

> **Note**: The app will build and deploy without Supabase env vars, but auth features will be disabled.

### Verify Deployment

After deploying, visit `https://your-domain.vercel.app/api/health` to confirm the deployment is working. You should see a JSON response with `"status": "ok"`.

### Troubleshooting 404 Errors

- Ensure the Vercel project is connected to the correct GitHub repository (`ChaseLGrant/CG-Recruiting-and-Development-`) and branch (`main`)
- Check the Vercel deployment logs for build errors
- Confirm the Framework Preset is set to **Next.js** in project settings
- Try redeploying from the Vercel dashboard

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
