# Google Service Account Credentials Setup

This guide explains how to set up Google Sheets service account credentials using a JSON file (recommended approach).

## Why Use a JSON File?

- ✅ **No escaping issues** - No need to escape quotes or newlines
- ✅ **Standard practice** - Common way to store service account keys
- ✅ **Easier to manage** - Direct JSON file, no environment variable parsing
- ✅ **Better for deployment** - Works seamlessly with Vercel and other platforms

---

## Setup Steps

### 1. Create the Service Account JSON File

1. **Copy your service account JSON key** from Google Cloud Console
   - The JSON should look like:
   ```json
   {
     "type": "service_account",
     "project_id": "hoadaoposts",
     "private_key_id": "...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "id-025hoadaoquery@hoadaoposts.iam.gserviceaccount.com",
     ...
   }
   ```

2. **Save it as `google-credentials.json`** in your project root (same folder as `package.json`)

   **Important**: Make sure the file is in your project root, not in a subdirectory.

### 2. Update `.env.local`

Add or update this environment variable:

```env
# Google Sheets Integration (using JSON file - recommended)
GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY_PATH=google-credentials.json
GOOGLE_SHEET_ID=1Meik15ONRTI1K_M76tg83ehD4niFrSMo7N6rlgLBWMo
GOOGLE_SHEET_RANGE=Schedule!A:C
```

**Note**: You can remove `GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY` from `.env.local` if you're using the file approach.

### 3. Share Google Sheet with Service Account

Make sure the Google Sheet is shared with the service account email:
- Email: `id-025hoadaoquery@hoadaoposts.iam.gserviceaccount.com`
- Permission: **Viewer** (read-only)

---

## Alternative: Using Environment Variable (Legacy)

If you prefer to keep using the environment variable approach, the code still supports it:

```env
GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL=id-025hoadaoquery@hoadaoposts.iam.gserviceaccount.com
GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

However, the **file-based approach is recommended** to avoid JSON escaping issues.

---

## File Structure

```
HoadaoOfficial/
├── google-credentials.json       ← Service account key (DO NOT COMMIT)
├── .env.local                   ← Environment variables
├── .gitignore                   ← Already excludes *.json credentials
└── src/
    └── lib/
        └── services/
            └── googleSheetsService.ts
```

---

## Security Notes

⚠️ **Important Security Reminders:**

1. ✅ `google-credentials.json` is already in `.gitignore` - **DO NOT COMMIT IT**
2. ✅ Never share the service account key publicly
3. ✅ For Vercel deployment, add the JSON file contents as a secret environment variable
4. ✅ Or upload the file securely to Vercel's file system

---

## Verifying Setup

After creating the file and updating `.env.local`:

1. Restart your dev server: `npm run dev`
2. Go to `/admin/calendar`
3. Click "Sync from Google Sheet"
4. You should see success or a conflict dialog (if data differs)

---

## Troubleshooting

### Error: "Failed to read Google service account key from file"

- Check that `google-credentials.json` exists in the project root
- Verify the file path in `.env.local` matches the actual filename
- Ensure the file contains valid JSON (use a JSON validator)

### Error: "Missing Google Sheets service account credentials"

- Verify `GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY_PATH` is set in `.env.local`
- Make sure the file path is relative to the project root
- Restart your dev server after changing `.env.local`

### Error: "The caller does not have permission"

- Share the Google Sheet with the service account email
- Grant **Viewer** access to the service account

---

*Last updated: After switching to file-based credentials*

