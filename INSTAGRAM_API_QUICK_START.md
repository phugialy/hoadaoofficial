# Instagram Graph API - Quick Start Guide

## 🎯 Goal

Get Instagram posts automatically synced to your website without manual URL imports.

## ⚡ 5-Minute Setup (Simplified)

### Step 1: Make Instagram Business Account

1. Instagram app → Settings → Account → Switch to Professional Account
2. Choose "Business"
3. Link to Facebook Page (create one if needed)

### Step 2: Create Facebook App

1. Go to: https://developers.facebook.com/apps/
2. Click **"+ Create App"**
3. Choose **"Business"** → Next
4. Fill in:
   - Name: "My Website Instagram"
   - Email: Your email
5. Click **"Create App"**

### Step 3: Add Instagram Product

1. In app dashboard, find **"Instagram"** in products list
2. Click **"Set Up"** button
3. Done! ✅

### Step 4: Get Access Token (Graph API Explorer)

1. Go to: https://developers.facebook.com/tools/explorer/
2. Select your app from dropdown (top right)
3. Click **"Generate Access Token"**
4. Select permissions:
   - ✅ `instagram_basic`
   - ✅ `pages_show_list`
5. Generate token
6. **Copy the token** (this is temporary)

### Step 5: Get Long-Lived Token

Open browser console or use this URL (replace values):

```
https://graph.facebook.com/v18.0/oauth/access_token?
  grant_type=fb_exchange_token&
  client_id=YOUR_APP_ID&
  client_secret=YOUR_APP_SECRET&
  fb_exchange_token=YOUR_SHORT_TOKEN
```

Replace:
- `YOUR_APP_ID` - From Settings → Basic → App ID
- `YOUR_APP_SECRET` - From Settings → Basic → App Secret (click Show)
- `YOUR_SHORT_TOKEN` - Token from Step 4

Copy the `access_token` from the response.

### Step 6: Get Instagram Business Account ID

In Graph API Explorer:

1. Use your long-lived token
2. Query: `me/accounts`
3. Find your page, get its `id`
4. Query: `{page-id}?fields=instagram_business_account`
5. Copy the `id` from `instagram_business_account`

**Or simpler:**
- Go to your Facebook Page → Settings → Instagram
- Your Instagram Business Account ID is shown there

### Step 7: Connect in Admin

1. Go to `/admin/instagram`
2. Click "Connect Instagram API (Optional)"
3. Paste:
   - Instagram Business Account ID (from Step 6)
   - Access Token (from Step 5)
4. Click "Connect"
5. Click "🔄 Sync Now"

---

## 🎉 Done!

Your Instagram posts are now syncing automatically!

## 🔄 Auto-Sync (Optional)

To sync automatically:
- Set up Vercel Cron Jobs (if on Vercel)
- Or use Supabase Edge Functions with cron
- Or manually click "Sync Now" when needed

## 📝 Example Values

**What you'll need:**
```
Instagram Business Account ID: 17841405309211844
Access Token: EAABwzLix... (long string)
```

**Where to find them:**
- Account ID: Facebook Page → Settings → Instagram
- Access Token: Graph API Explorer (after generating)

---

## 🆘 Quick Troubleshooting

**"Token expired"** → Get a new token from Graph API Explorer  
**"Cannot find Instagram account"** → Make sure it's Business/Creator, not Personal  
**"App Review Required"** → Add yourself as Admin in app settings  

For detailed setup, see `FACEBOOK_APP_INSTAGRAM_SETUP.md`
