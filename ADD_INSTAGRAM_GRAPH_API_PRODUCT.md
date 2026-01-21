# How to Add Instagram Graph API Product to Facebook App

## Quick Visual Guide

### Step 1: Access Your Facebook App Dashboard

1. Go to https://developers.facebook.com/apps/
2. Log in with your Facebook account
3. You'll see a list of your apps (or empty if this is your first)
4. Click on your app name to open it

**If you don't have an app yet:**
- Click **"+ Create App"** button (top right, blue button)
- Choose **"Business"** type
- Fill in app name and email
- Click **"Create App"**

---

### Step 2: Find the Products Section

Once in your app dashboard, you have **two ways** to add Instagram Graph API:

#### Method A: Quick Add (Easiest)

1. Look at the **main dashboard** screen
2. You'll see a section titled **"Add Products to Your App"** or **"Products"**
3. Scroll through the products list
4. Find **"Instagram"** or **"Instagram Graph API"**
5. Next to it, you'll see a **"Set Up"** or **"Get Started"** button
6. Click that button

#### Method B: Add Product Button

1. Look at the **left sidebar menu**
2. Find **"Add Product"** or **"Products"** → **"Add Product"**
3. Click it
4. A page with all available products will load
5. Find **"Instagram"** in the list
6. Click the **"Set Up"** button next to it

---

### Step 3: Configure Instagram Graph API

After clicking "Set Up", you'll see:

1. **Instagram Graph API** product page loads
2. You may see:
   - Basic Display setup
   - Graph API setup
   - Configuration options

**What to configure:**

1. **Valid OAuth Redirect URIs** (Important!)
   - Add: `https://your-domain.com/admin/instagram/callback`
   - Add: `http://localhost:3000/admin/instagram/callback` (for local dev)
   - Click **"Save Changes"**

2. **Deauthorize Callback URL** (Optional)
   - Can leave blank for now

3. **Data Deletion Request URL** (Optional)
   - Can leave blank for now

---

### Step 4: Verify Product is Added

1. Check the **left sidebar**
2. You should now see **"Instagram"** or **"Instagram Graph API"** listed under products
3. Click on it to access Instagram-specific settings

---

## Screenshots Guide (What You'll See)

### Dashboard View:
```
┌─────────────────────────────────────┐
│  My App Name              [Settings]│
├─────────────────────────────────────┤
│                                     │
│  Add Products to Your App           │
│  ┌─────────┐  ┌─────────┐          │
│  │ Facebook│  │ Instagram│ ← Click │
│  │  Set Up │  │  Set Up  │   Here  │
│  └─────────┘  └─────────┘          │
│                                     │
│  ┌─────────┐  ┌─────────┐          │
│  │   ...   │  │   ...   │          │
│  └─────────┘  └─────────┘          │
└─────────────────────────────────────┘
```

### Left Sidebar After Adding:
```
┌─────────────────┐
│ Products ▼      │
│  • Facebook     │
│  • Instagram ←  │ (New!)
│                 │
│ Settings        │
│ Tools           │
└─────────────────┘
```

---

## Common Issues & Solutions

### Issue: "I don't see Instagram in the products list"

**Solution:**
1. Make sure you selected **"Business"** app type when creating
2. Some product names vary:
   - Look for **"Instagram"**
   - Look for **"Instagram Graph API"**
   - Look for **"Instagram Basic Display"**
3. Try refreshing the page
4. If still not there, try creating a new app with "Business" type

### Issue: "Set Up button is grayed out"

**Solution:**
1. Complete your app's basic settings first
2. Go to **Settings** → **Basic**
3. Fill in required fields (App Domain, Privacy Policy URL, etc.)
4. Save changes
5. Try again

### Issue: "OAuth Redirect URI error"

**Solution:**
1. Make sure you added the redirect URI exactly as shown
2. Include `https://` or `http://` protocol
3. No trailing slashes
4. Example: `https://www.yourdomain.com/admin/instagram/callback`

---

## What Happens After Adding

Once Instagram Graph API is added:

1. ✅ Product appears in sidebar
2. ✅ You can configure Instagram settings
3. ✅ You can generate access tokens
4. ✅ You can use Graph API Explorer
5. ✅ Ready to connect to your website

---

## Next Steps After Adding Product

1. **Configure OAuth Redirect URIs** (Important!)
2. **Get Access Token** (via Graph API Explorer)
3. **Get Instagram Business Account ID**
4. **Connect in `/admin/instagram`**

See `INSTAGRAM_API_QUICK_START.md` for the complete flow.

---

## Video Walkthrough (Text Version)

1. **Navigate to**: developers.facebook.com/apps/
2. **Click**: Your app name (or create new app)
3. **Look for**: "Add Products" section or sidebar menu
4. **Find**: "Instagram" product card
5. **Click**: "Set Up" button
6. **Configure**: OAuth redirect URIs
7. **Save**: Changes
8. **Verify**: Instagram appears in sidebar

---

## Alternative: Using URL Import

If adding the API product seems complex, remember:
- You can use **URL Import** feature instead
- No API setup needed
- Just paste Instagram URLs
- Works immediately!

See `INSTAGRAM_NO_API_SETUP.md` for URL import guide.

---

## Need Help?

**Facebook Developer Resources:**
- [Facebook Developers Docs](https://developers.facebook.com/docs/)
- [Instagram Graph API Docs](https://developers.facebook.com/docs/instagram-api)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/) - Test your API calls

**Common Questions:**
- Q: Do I need to pay? → A: No, Facebook Developer account is free
- Q: How long does setup take? → A: 10-15 minutes
- Q: Do I need App Review? → A: Only for production, not for testing
