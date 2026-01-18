# Google Service Account Credentials - Deployment Guide

## Security Best Practices

**Never commit credentials to Git!** ✅ Already handled - `google-credentials.json` is in `.gitignore`

## Local Development (Current Setup)

✅ **Use JSON file** (`google-credentials.json`) - Safe because:
- File is in `.gitignore` - won't be committed
- Only exists on your local machine
- Easy to manage and edit

## Production Deployment (Vercel/Other Platforms)

For production, you have **three options**:

### Option 1: Environment Variable (Recommended for Vercel)

Store the JSON as a **single-line environment variable** in Vercel:

1. **In Vercel Dashboard:**
   - Go to your project → Settings → Environment Variables
   - Add: `GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY`
   - Value: The full JSON object as a **single line** (no line breaks)
   - Select environment: Production, Preview, Development

2. **Format the JSON:**
   - Remove all line breaks and extra spaces
   - Keep as one long JSON string
   - Example: `{"type":"service_account","project_id":"hoadaoposts",...}`

3. **Code handles it:**
   - Our code already supports this (fallback to env var)
   - It will parse the JSON string from the environment variable

### Option 2: Base64 Encoding (More Reliable)

Store the JSON file content as base64-encoded string:

1. **Encode locally:**
   ```bash
   # Convert JSON file to base64
   certutil -encode google-credentials.json temp.txt
   # Or use PowerShell:
   $json = Get-Content google-credentials.json -Raw
   [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($json))
   ```

2. **In Vercel:**
   - Add env var: `GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY_B64`
   - Value: The base64-encoded string

3. **Update code** to decode base64 (we can add this if needed)

### Option 3: Individual Fields (Most Flexible)

Split into separate environment variables:
- `GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_SHEETS_PROJECT_ID`
- `GOOGLE_SHEETS_PRIVATE_KEY` (just the private key, with `\n` preserved)
- etc.

---

## Recommended Approach

**For Vercel:** Use **Option 1** (Environment Variable with single-line JSON)

**Why?**
- ✅ Already supported by our code
- ✅ Vercel handles environment variables well
- ✅ Easy to update in dashboard
- ✅ No code changes needed

**Setup Steps:**
1. Take your `google-credentials.json` content
2. Convert to single line (remove line breaks, keep `\n` sequences for private key)
3. Add as `GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY` in Vercel
4. Don't set `GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY_PATH` in production

---

## Current Code Behavior

The code supports **both methods**:
- **Local dev**: Uses `GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY_PATH=google-credentials.json`
- **Production**: Falls back to `GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY` (env var)

You can switch between them based on environment! 🎯

