# Mailtrap Setup Summary

## ✅ Completed Setup

### 1. Mailtrap Email API Integration

**Status**: ✅ Configured and Verified

- **API Token**: `5d62b8d34572f8b966abe4734f8aa6df` (verified working)
- **Service Created**: `src/lib/services/mailtrapService.ts`
  - `sendMailtrapEmail()` - Generic email sending function
  - `sendTestEmail()` - Test email helper
- **Test Endpoint**: `POST /api/test/mailtrap`
  - Can be used to send test emails
  - Example: `POST http://localhost:3000/api/test/mailtrap` with body `{"to": "bigpstudio@gmail.com"}`

### 2. Admin User Creation

**Status**: ✅ API Endpoint Created

- **Endpoint**: `POST /api/admin/create-admin-user`
- **Location**: `src/app/api/admin/create-admin-user/route.ts`
- **Functionality**:
  - Creates admin user: `bigpstudio@gmail.com` / `hoadaoliondance.com`
  - Sets `is_admin: true` in user metadata
  - Auto-confirms email (skips confirmation requirement)
  - Handles existing users gracefully (updates metadata if user exists)

**To Create Admin User**:
```bash
# Option 1: Via API (requires SUPABASE_SERVICE_ROLE_KEY in .env.local)
curl -X POST http://localhost:3000/api/admin/create-admin-user \
  -H "Content-Type: application/json"

# Option 2: Via Supabase Dashboard (see AUTH_SETUP_INSTRUCTIONS.md)
```

### 3. Documentation Updated

- ✅ `AUTH_SETUP_INSTRUCTIONS.md` - Added Mailtrap SMTP setup instructions
- ✅ `ENV_SETUP_INSTRUCTIONS.md` - Added `MAILTRAP_API_TOKEN` to env vars

---

## ⏳ Remaining Manual Steps

### 1. Get Mailtrap SMTP Credentials (for Supabase Auth)

To configure Supabase Auth to send confirmation emails via Mailtrap:

1. Go to: https://mailtrap.io/inboxes
2. Select your inbox
3. Click **"SMTP Settings"** tab
4. Copy:
   - **Host**: `sandbox.smtp.mailtrap.io` (testing) or `smtp.mailtrap.io` (production)
   - **Port**: `2525` (default) or `587` (TLS)
   - **Username**: (shown in dashboard)
   - **Password**: (shown in dashboard)

### 2. Configure Supabase SMTP

1. Go to: https://supabase.com/dashboard/project/cwvaodyhtwcmbfglqwmk/auth/smtp
2. Enable **"Enable Custom SMTP"**
3. Enter Mailtrap SMTP credentials from step 1
4. Set:
   - **Sender Email**: `no-reply@hoadaoofficial.com`
   - **Sender Name**: `HoadaoOfficial`
5. Click **"Save"**

### 3. Create Admin User

**Option A**: Via API endpoint (if `SUPABASE_SERVICE_ROLE_KEY` is set):
```bash
POST http://localhost:3000/api/admin/create-admin-user
```

**Option B**: Via Supabase Dashboard (see `AUTH_SETUP_INSTRUCTIONS.md` for details)

---

## 🧪 Testing

### Test Mailtrap Email API
```bash
# Send test email via API
curl -X POST http://localhost:3000/api/test/mailtrap \
  -H "Content-Type: application/json" \
  -d '{"to": "bigpstudio@gmail.com"}'
```

### Test Admin Login
1. After admin user is created, go to: `http://localhost:3000/admin/login`
2. Login with:
   - Email: `bigpstudio@gmail.com`
   - Password: `hoadaoliondance.com`

---

## 📝 Notes

- **API Token vs SMTP Credentials**: 
  - API Token (`5d62b8d34572f8b966abe4734f8aa6df`) = For sending emails programmatically via Mailtrap Email API
  - SMTP Credentials (username/password) = For Supabase Auth to send confirmation/reset emails
  - You need **both** for full functionality

- **Email Confirmations**: Enabled by default on Supabase hosted projects. Admin user creation bypasses this for initial setup.

- **Service Role Key**: Required for admin operations (creating users, updating metadata). Must be in `.env.local` as `SUPABASE_SERVICE_ROLE_KEY`.

