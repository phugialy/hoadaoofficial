# Instagram Account Connection Setup Guide

## Overview

You can now connect your Instagram Business/Creator account to automatically sync posts to your website. This guide walks you through the setup process.

## Prerequisites

✅ **Instagram Business or Creator Account** (Personal accounts don't work with the API)  
✅ **Facebook Page** connected to your Instagram account  
✅ **Facebook Developer Account** (free to create)

## Step-by-Step Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Business"** as the app type
4. Fill in:
   - **App Name**: e.g., "HoadaoOfficial Website"
   - **App Contact Email**: Your email
   - **Business Account**: (optional)
5. Click **"Create App"**

### Step 2: Add Instagram Graph API

1. In your app dashboard, click **"Add Product"**
2. Find **"Instagram Graph API"** and click **"Set Up"**
3. Follow the setup wizard

### Step 3: Connect Instagram to Facebook Page

1. Make sure your Instagram account is a **Business** or **Creator** account
2. Go to your Instagram account settings → **Account** → **Linked Accounts**
3. Link your Instagram to a Facebook Page
   - If you don't have a Facebook Page, create one first
   - The Page must be published (not draft)

### Step 4: Get Your Instagram Business Account ID

1. In Facebook Developers, go to **Instagram Graph API** → **Basic Display**
2. Or use the Graph API Explorer:
   - Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
   - Select your app
   - Get a Page Access Token with `instagram_basic`, `pages_show_list`, `pages_read_engagement` permissions
   - Query: `me/accounts` to get your pages
   - Query: `{page-id}?fields=instagram_business_account` to get Instagram Business Account ID

**Alternative Method:**
1. Go to your Facebook Page → Settings → Instagram
2. Your Instagram Business Account ID should be visible there

### Step 5: Get Access Token

#### Option A: Long-Lived Page Access Token (Recommended)

1. Go to [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
2. Select your app
3. Get a **Page Access Token** (not User Access Token)
4. Exchange it for a long-lived token:
   ```
   GET /oauth/access_token?
     grant_type=fb_exchange_token&
     client_id={app-id}&
     client_secret={app-secret}&
     fb_exchange_token={short-lived-token}
   ```
5. Use this long-lived token (expires in ~60 days)

#### Option B: User Access Token (Temporary)

1. In Graph API Explorer, generate a User Access Token
2. Add permissions: `instagram_graph_user_profile`, `instagram_graph_user_media`
3. This token expires quickly, so you'll need to refresh it

### Step 6: Connect in Admin Dashboard

1. Go to `/admin/instagram` in your website
2. Click **"Connect Instagram Account"**
3. Fill in:
   - **Instagram Business Account ID**: From Step 4
   - **Access Token**: From Step 5
   - **Username**: Your Instagram username (optional)
4. Click **"Connect"**

### Step 7: Sync Posts

1. After connecting, click **"🔄 Sync Now"** button
2. This will fetch your latest Instagram posts and save them to the database
3. Posts will appear in the Instagram Posts manager below
4. They'll automatically show on your homepage and social page

## Automatic Syncing

Currently, syncing is manual. To set up automatic syncing:

1. **Option 1**: Use Vercel Cron Jobs
   - Create `/api/cron/instagram-sync/route.ts`
   - Set up cron schedule in `vercel.json`

2. **Option 2**: Use Supabase Edge Functions
   - Create a scheduled function to call the sync endpoint

3. **Option 3**: Manual sync
   - Click "Sync Now" button whenever you want to update posts

## Token Management

### Token Expiration

- **Short-lived tokens**: Expire in 1-2 hours
- **Long-lived tokens**: Expire in ~60 days
- **Page Access Tokens**: Don't expire (but can be revoked)

### Refreshing Tokens

When your token expires:

1. Go to `/admin/instagram`
2. Click **"Update Connection"**
3. Get a new access token from Facebook Developers
4. Paste the new token and click **"Update"**

## Troubleshooting

### "Instagram not connected"
- Make sure you've completed Step 6 and saved the connection
- Check that the connection shows as "Connected" in the admin panel

### "Failed to fetch from Instagram API"
- Verify your access token is valid and not expired
- Check that your Instagram account is Business/Creator (not Personal)
- Ensure Instagram is linked to a Facebook Page
- Verify you have the correct permissions (`instagram_basic`, `pages_read_engagement`)

### "Token expired"
- Get a new access token from Facebook Developers
- Update the connection with the new token

### Posts not syncing
- Check that `sync_enabled` is `true` in the connection
- Verify your Instagram Business Account ID is correct
- Make sure you have posts on your Instagram account
- Check browser console and server logs for errors

## API Endpoints

### Admin Endpoints

- `GET /api/admin/instagram/connect` - Get connection status
- `POST /api/admin/instagram/connect` - Save connection credentials
- `DELETE /api/admin/instagram/connect` - Disconnect Instagram
- `POST /api/admin/instagram/sync` - Sync posts from Instagram

### Public Endpoints

- `GET /api/instagram/posts` - Get active Instagram posts (used by homepage)

## Security Notes

- ⚠️ Access tokens are stored encrypted in Supabase
- ⚠️ Only admin users can access connection settings
- ⚠️ Never share your access token publicly
- ⚠️ Rotate tokens regularly for security

## Next Steps

After connecting:

1. ✅ Click "Sync Now" to fetch your posts
2. ✅ Review posts in the manager below
3. ✅ Toggle posts active/inactive as needed
4. ✅ Set display order for posts
5. ✅ Posts will appear on homepage automatically

## Resources

- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)
- [Facebook Developers](https://developers.facebook.com/)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Instagram Business Setup](https://www.facebook.com/business/help/898752960195806)
