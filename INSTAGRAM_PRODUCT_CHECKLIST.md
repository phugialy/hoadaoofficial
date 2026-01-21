# Adding Instagram Graph API Product - Simple Checklist

## ✅ Step-by-Step Checklist

### Step 1: Go to Facebook Developers
- [ ] Open: https://developers.facebook.com/apps/
- [ ] Log in with Facebook account

### Step 2: Create or Select App
- [ ] Click **"+ Create App"** (if new) OR
- [ ] Click on existing app name (if you have one)

**If creating new app:**
- [ ] Choose **"Business"** type
- [ ] Enter app name: "My Website Instagram"
- [ ] Enter your email
- [ ] Click **"Create App"**

### Step 3: Add Instagram Product

**Option A: From Dashboard (Easiest)**
- [ ] On main dashboard, find **"Products"** section
- [ ] Scroll to find **"Instagram"** card
- [ ] Click **"Set Up"** button next to it

**Option B: From Sidebar**
- [ ] Click **"Add Product"** in left sidebar
- [ ] Find **"Instagram"** in the products list
- [ ] Click **"Set Up"** button

### Step 4: Verify Product Added
- [ ] Check left sidebar - you should see **"Instagram"** listed
- [ ] Click on it to see Instagram configuration page

### Step 5: Configure OAuth Redirect URIs (Important!)
- [ ] In Instagram settings, find **"Valid OAuth Redirect URIs"**
- [ ] Add: `http://localhost:3000/admin/instagram/callback`
- [ ] Add: `https://your-domain.com/admin/instagram/callback` (your actual domain)
- [ ] Click **"Save Changes"**

---

## 🎯 What "Instagram Graph API Product" Means

When you add the "Instagram" product to your Facebook App, you're enabling:
- ✅ Ability to use Instagram Graph API
- ✅ Access to generate Instagram access tokens
- ✅ Permission to fetch Instagram posts programmatically
- ✅ Integration with your website

**Think of it as:** Adding a feature/plugin to your app that enables Instagram functionality.

---

## 📍 Where to Find It

### Location 1: Main Dashboard
```
┌────────────────────────────────────┐
│  Your App Dashboard                │
│                                    │
│  Add Products to Your App          │
│  ┌──────────┐  ┌──────────┐      │
│  │ Facebook │  │Instagram │ ← HERE│
│  │  Set Up  │  │  Set Up  │      │
│  └──────────┘  └──────────┘      │
└────────────────────────────────────┘
```

### Location 2: Add Product Menu
```
Left Sidebar:
  Add Product → [Products List] → Instagram → Set Up
```

---

## ⚠️ Common Confusion

**Q: Is "Instagram Graph API" a separate product from "Instagram"?**  
A: Usually they're the same. Facebook may label it as:
- "Instagram"
- "Instagram Graph API"  
- "Instagram Basic Display"

All of these enable Instagram API access.

**Q: What if I don't see "Instagram" in the list?**  
A: 
1. Make sure your app type is "Business" (not "Consumer")
2. Try refreshing the page
3. Complete app basic settings first (Settings → Basic)

**Q: Do I need to code anything to add the product?**  
A: No! Just click "Set Up" button. It's just configuration in the Facebook dashboard.

---

## 🚀 After Adding Product

Once you see "Instagram" in your sidebar:
1. ✅ Product is added successfully
2. ✅ You can now use Graph API Explorer
3. ✅ You can generate access tokens
4. ✅ Ready to connect to your website

**Next:** Follow `INSTAGRAM_API_QUICK_START.md` to get your credentials.

---

## 💡 Pro Tip

The "Set Up" button is just enabling the feature. No complex configuration needed at this step - you're just adding the Instagram product capability to your app!
