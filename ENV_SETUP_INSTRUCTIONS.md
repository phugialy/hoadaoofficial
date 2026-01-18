# Environment Variables Setup

## Quick Setup

1. **Copy the example file**:
   ```bash
   cp .env.example .env.local
   ```

2. **Get your Supabase API keys**:
   - Go to: https://supabase.com/dashboard/project/cwvaodyhtwcmbfglqwmk
   - Navigate to: **Settings** → **API**
   - Copy the keys and paste them into `.env.local`

3. **Your `.env.local` should look like**:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=https://cwvaodyhtwcmbfglqwmk.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   
   # Google Sheets Integration
   GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL=id-025hoadaoquery@hoadaoposts.iam.gserviceaccount.com
   GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"hoadaoposts",...}
   GOOGLE_SHEET_ID=1Meik15ONRTI1K_M76tg83ehD4niFrSMo7N6rlgLBWMo
   GOOGLE_SHEET_RANGE=Schedule!A:C
   
   # Mailtrap.io (for transactional emails via API)
   MAILTRAP_API_TOKEN=5d62b8d34572f8b966abe4734f8aa6df
   ```

## Important Notes

- ⚠️ **Never commit `.env.local` to git** (it's already in `.gitignore`)
- ✅ The Supabase URL is already filled in
- 🔑 You only need to add the two API keys
- 🔒 Keep `SUPABASE_SERVICE_ROLE_KEY` secret - it has admin access
- 📊 **Google Sheets**: `GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY` must be the full JSON key as a single-line string (use escaped quotes or keep as JSON)
- 📧 **Mailtrap**: `MAILTRAP_API_TOKEN` is for sending transactional emails via Mailtrap Email API (already configured)

## Verify Setup

After creating `.env.local`, test the connection:

```bash
npm run dev
```

If you see no errors, the connection is working! ✅


