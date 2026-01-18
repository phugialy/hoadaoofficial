# Quick Fix: Create google-credentials.json

The environment variable parsing is failing. Let's use the **file-based approach** which works better.

## Option 1: Manual (Easiest)

1. **Get your original service account JSON** from Google Cloud Console:
   - Go to: https://console.cloud.google.com/iam-admin/serviceaccounts
   - Find your service account → Create Key → JSON format
   - Download the JSON file

2. **Create `google-credentials.json` in your project root:**
   - Copy the entire contents from the downloaded JSON file
   - Paste into a new file called `google-credentials.json` in your project root
   - Make sure it's valid JSON (starts with `{` and ends with `}`)

3. **Verify `.env.local` has:**
   ```
   GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY_PATH=google-credentials.json
   ```

4. **Restart dev server** and try syncing again!

## Option 2: Extract from .env.local (If you don't have original)

If you only have the escaped version in `.env.local`, we need to properly unescape it:

**The problem:** The JSON in `.env.local` has `\"` (escaped quotes) and `\n` (escaped newlines) which are causing parsing issues.

**Best solution:** Get the original JSON file from Google Cloud Console (Option 1 above) - this avoids all escaping issues.

---

## Why File-Based Works Better

✅ **No escaping issues** - JSON file is read directly  
✅ **Standard format** - Matches what Google gives you  
✅ **Easy to validate** - Just check if file is valid JSON  
✅ **Safe** - File is in `.gitignore`, won't be committed

---

**After creating the file, restart your dev server and try syncing!** 🚀

