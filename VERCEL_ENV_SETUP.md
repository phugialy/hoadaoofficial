# Vercel Environment Variables Setup

## Issue
Your Vercel deployment is failing because the `NEXT_PUBLIC_SUPABASE_URL` environment variable is missing, causing the `/api/events` endpoint to fail with a 500 error.

## Solution

### Step 1: Get Your Supabase API Keys

**Option A: Copy from your local `.env.local` file** (Recommended - fastest)
Your `.env.local` already has the correct keys. Just copy them:

```bash
# From your .env.local file:
NEXT_PUBLIC_SUPABASE_URL=https://cwvaodyhtwcmbfglqwmk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ztEl-TwPY8YL7Qx_XcKJ8A_Z8gP1XzE
SUPABASE_SERVICE_ROLE_KEY=sb_secret_cNh35MDE-xw1FqUDfO6hlQ_kUhfjVGL
```

**Option B: Get from Supabase Dashboard**
1. Go to your Supabase Dashboard:
   - **URL**: https://supabase.com/dashboard/project/cwvaodyhtwcmbfglqwmk/settings/api

2. Copy the following values:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
     - Already filled: `https://cwvaodyhtwcmbfglqwmk.supabase.co`
   - **Publishable key** (new format: `sb_publishable_...`) OR **anon public** key (JWT format) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Secret key** (new format: `sb_secret_...`) OR **service_role** key (JWT format) → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ Keep this secret!)

**Note**: Both new format (`sb_publishable_...`/`sb_secret_...`) and legacy JWT format keys work. Your local file uses the new format, which is recommended.

### Step 2: Configure Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=https://cwvaodyhtwcmbfglqwmk.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_ztEl-TwPY8YL7Qx_XcKJ8A_Z8gP1XzE
   SUPABASE_SERVICE_ROLE_KEY=sb_secret_cNh35MDE-xw1FqUDfO6hlQ_kUhfjVGL
   ```

   **Quick Copy**: These are the exact values from your `.env.local` file. Just copy-paste them!

4. **Important**: Make sure to select the correct environments:
   - ✅ **Production**
   - ✅ **Preview**
   - ✅ **Development** (if you want to test locally with Vercel CLI)

### Step 3: Redeploy

After adding the environment variables:

1. Go to **Deployments** tab
2. Click the **"..."** menu on the latest deployment
3. Select **"Redeploy"**
4. Or push a new commit to trigger a new deployment

### Step 4: Verify

After redeployment, check:
- The `/api/events` endpoint should return 200 instead of 500
- The events page should load without errors
- Check Vercel logs to confirm no more "Missing NEXT_PUBLIC_SUPABASE_URL" errors

## Local Development Setup

For local development, create a `.env.local` file in the root directory:

```bash
# Copy from .env.example if it exists, or create manually
```

Then add your keys (same values as Vercel).

## Troubleshooting

### Still seeing errors?
1. **Double-check** the environment variable names (case-sensitive!)
2. **Verify** the Supabase project is active and healthy
3. **Check** Vercel logs for specific error messages
4. **Ensure** you've redeployed after adding the variables

### Quick Test
You can test locally first:
```bash
npm run dev
```

If it works locally but fails on Vercel, it's definitely a missing environment variable issue.
