# Facebook App Setup for Instagram Graph API - Step-by-Step Guide

## Overview

This guide walks you through creating a Facebook App and enabling Instagram Graph API access. This allows you to automatically sync Instagram posts to your website.

## Prerequisites

✅ **Facebook Account** (personal or business)  
✅ **Instagram Business or Creator Account** (not personal)  
✅ **Facebook Page** connected to your Instagram account

---

## Step 1: Convert Instagram to Business/Creator Account

**Important:** The Instagram Graph API only works with Business or Creator accounts, not personal accounts.

1. Open Instagram mobile app
2. Go to **Settings** → **Account**
3. Tap **"Switch to Professional Account"**
4. Choose **Business** or **Creator**
5. Connect to a **Facebook Page** (create one if you don't have it)
6. Complete the setup

---

## Step 2: Create Facebook Developer Account

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"Get Started"** or **"Log In"**
3. Accept the terms and complete registration
4. Verify your account (may require phone number)

---

## Step 3: Create a Facebook App

1. Go to [Facebook Developers Dashboard](https://developers.facebook.com/apps/)
2. Click **"+ Create App"** button (top right)
3. Choose app type:
   - Select **"Business"** (recommended) or **"Consumer"**
   - Click **"Next"**
4. Fill in app details:
   - **App Name**: e.g., "HoadaoOfficial Website" or "My Website Instagram Feed"
   - **App Contact Email**: Your email address
   - **Business Account**: (Optional - you can skip this)
   - **App Purpose**: Select "Build Connected Experiences"
5. Click **"Create App"**
6. Complete security check (if prompted)

---

## Step 4: Add Instagram Graph API Product

### Method 1: Quick Setup (Recommended)

1. In your app dashboard, you'll see **"Add Products"** section
2. Find **"Instagram"** or **"Instagram Graph API"** in the products list
3. Click **"Set Up"** button next to it
4. Follow the setup wizard

### Method 2: Manual Addition

1. In your app dashboard, click **"Add Product"** in the left sidebar
2. Scroll down to find **"Instagram"** product
3. Click **"Set Up"** button
4. The Instagram Graph API will be added to your app

---

## Step 5: Configure Instagram Graph API

1. After adding the product, you'll see **"Instagram"** in the left sidebar
2. Click **"Instagram"** → **"Basic Display"** or **"Graph API"**
3. You'll see configuration options

---

## Step 6: Set Up OAuth Redirect URIs

1. Go to **Settings** → **Basic** (in left sidebar)
2. Scroll down to **"Add Platform"**
3. Add your website domains:
   - Click **"Add Platform"** → **"Website"**
   - Add your site URL (e.g., `https://www.hoadaoliondance.com`)
   - Also add `http://localhost:3000` for local development
4. Click **"Save Changes"**

### For Instagram Graph API specifically:

1. Go to **"Products"** → **"Instagram"** → **"Basic Display"**
2. Find **"Valid OAuth Redirect URIs"**
3. Add redirect URIs:
   ```
   https://www.hoadaoliondance.com/admin/instagram/callback
   http://localhost:3000/admin/instagram/callback
   ```
4. Click **"Save Changes"**

---

## Step 7: Get Your App ID and App Secret

1. Go to **Settings** → **Basic**
2. You'll see:
   - **App ID**: Copy this (you'll need it)
   - **App Secret**: Click **"Show"** and copy it (keep this secret!)

---

## Step 8: Link Instagram Business Account to Facebook Page

1. Make sure your Instagram is connected to a Facebook Page:
   - Go to your Instagram app → **Settings** → **Account** → **Linked Accounts**
   - Connect to Facebook Page
2. Go to your Facebook Page → **Settings** → **Instagram**
3. Confirm your Instagram account is linked
4. Note your **Instagram Business Account ID** (shown in Page Settings → Instagram)

---

## Step 9: Get Access Token

### Option A: Using Graph API Explorer (Easiest for Testing)

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app from the dropdown (top right)
3. Click **"Generate Access Token"**
4. Select permissions:
   - `instagram_basic`
   - `instagram_graph_user_profile`
   - `pages_show_list`
   - `pages_read_engagement`
5. Click **"Generate Access Token"**
6. Authorize the app
7. Copy the token (this is a **short-lived token**, expires in 1-2 hours)

### Option B: Exchange for Long-Lived Token

1. Use the short-lived token from Step 9A
2. Make a GET request to:
   ```
   https://graph.facebook.com/v18.0/oauth/access_token?
     grant_type=fb_exchange_token&
     client_id={your-app-id}&
     client_secret={your-app-secret}&
     fb_exchange_token={short-lived-token}
   ```
3. You'll get a **long-lived token** (expires in ~60 days)

### Option C: Get Page Access Token (Recommended - Doesn't Expire)

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Add permissions: `pages_show_list`, `pages_read_engagement`
4. Generate token
5. Query: `me/accounts` to get your pages
6. For each page, query: `{page-id}?fields=access_token,instagram_business_account`
7. The `access_token` is your Page Access Token (doesn't expire unless revoked)

---

## Step 10: Get Instagram Business Account ID

1. Go to your Facebook Page → **Settings** → **Instagram**
2. Your Instagram Business Account ID is shown there
   - Or use Graph API: `{page-id}?fields=instagram_business_account`
   - The ID will look like: `17841405309211844`

---

## Step 11: Connect in Your Admin Dashboard

1. Go to `/admin/instagram` in your website
2. Click **"Connect Instagram API (Optional)"**
3. Fill in:
   - **Instagram Business Account ID**: From Step 10
   - **Access Token**: From Step 9 (long-lived or page token)
   - **Username**: Your Instagram username (optional)
4. Click **"Connect"**

---

## Step 12: Test the Connection

1. After connecting, click **"🔄 Sync Now"**
2. Your Instagram posts should be imported automatically
3. Check the Instagram Posts manager below to see imported posts

---

## Troubleshooting

### "App Review Required"

If you see "App Review Required":
- Your app is in **Development Mode**
- For testing, add yourself as a **Test User** or **Admin**
- Go to **Roles** → **Roles** → Add yourself as **Admin**
- For production, submit your app for **App Review**

### "Invalid OAuth Redirect URI"

- Make sure you added your redirect URIs in Step 6
- Check that URLs match exactly (including https/http)

### "Invalid Access Token"

- Token may have expired (short-lived tokens expire quickly)
- Get a new token or use a long-lived/page token
- Make sure you selected the correct permissions

### "Instagram account not linked to Facebook Page"

- Go to Instagram → Settings → Account → Linked Accounts
- Connect to Facebook Page
- Make sure the Page is published (not draft)

### "Cannot get Instagram Business Account ID"

- Verify Instagram is Business/Creator account
- Make sure it's linked to a Facebook Page
- Try querying via Graph API: `{page-id}?fields=instagram_business_account`

---

## Important Notes

⚠️ **Development vs Production:**
- In Development Mode, only you and test users can use the app
- For production, submit your app for **App Review**
- App Review can take 7-14 days

⚠️ **Token Expiration:**
- Short-lived tokens: 1-2 hours
- Long-lived tokens: ~60 days
- Page Access Tokens: Don't expire (best option)

⚠️ **Permissions:**
- You need `instagram_basic` permission minimum
- Additional permissions may require App Review

---

## Quick Reference

**App Dashboard:** https://developers.facebook.com/apps/  
**Graph API Explorer:** https://developers.facebook.com/tools/explorer/  
**Instagram Graph API Docs:** https://developers.facebook.com/docs/instagram-api  

**Useful Endpoints:**
```
# Get your pages
GET /me/accounts?access_token={token}

# Get Instagram Business Account for a page
GET /{page-id}?fields=instagram_business_account&access_token={token}

# Get Instagram posts
GET /{instagram-business-account-id}/media?access_token={token}
```

---

## Alternative: Use URL Import Instead

If setting up the API seems complex, you can:
- Use the **URL Import** feature (no API needed)
- Just paste Instagram post URLs
- Works immediately without any setup

See `INSTAGRAM_NO_API_SETUP.md` for details.

---

## Next Steps

After setting up:
1. ✅ Connect in `/admin/instagram`
2. ✅ Click "Sync Now" to fetch posts
3. ✅ Posts appear automatically on homepage
4. ✅ Set up automatic syncing (optional - via cron jobs)

Good luck! 🚀
