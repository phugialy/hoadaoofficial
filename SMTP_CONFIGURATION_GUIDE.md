# SMTP Configuration Guide for Supabase Auth

## Quick Steps to Configure Mailtrap SMTP

### 1. Get Mailtrap SMTP Credentials

1. Go to: **https://mailtrap.io/inboxes**
2. Select your inbox (or create a new one)
3. Click **"SMTP Settings"** tab (or **"Integration"** → **"SMTP"**)
4. Copy these credentials:
   - **Host**: `sandbox.smtp.mailtrap.io` (for testing) or `smtp.mailtrap.io` (for production)
   - **Port**: `2525` (default) or `587` (TLS) or `465` (SSL)
   - **Username**: (e.g., `abc123def456`)
   - **Password**: (e.g., `xyz789uvw012`)

### 2. Configure in Supabase Dashboard

1. **Go to Supabase Dashboard**:
   - URL: https://supabase.com/dashboard/project/cwvaodyhtwcmbfglqwmk/auth/smtp

2. **Enable Custom SMTP**:
   - Toggle **"Enable Custom SMTP"** to **ON**

3. **Enter Mailtrap Credentials**:
   - **SMTP Host**: `sandbox.smtp.mailtrap.io` (or `smtp.mailtrap.io`)
   - **SMTP Port**: `2525` (or `587` for TLS)
   - **SMTP User**: (your Mailtrap username from step 1)
   - **SMTP Password**: (your Mailtrap password from step 1)
   - **Sender Email**: `no-reply@hoadaoofficial.com` (or your preferred sender)
   - **Sender Name**: `HoadaoOfficial`

4. **Save Settings**:
   - Click **"Save"** button at the bottom

### 3. Test SMTP Configuration

After saving:
1. Try to sign up a test user in your app
2. Check your **Mailtrap inbox** - you should see the confirmation email there
3. If emails arrive in Mailtrap inbox, SMTP is working correctly! ✅

---

## Important Notes

- **API Token vs SMTP Credentials**: 
  - API Token (`5d62b8d34572f8b966abe4734f8aa6df`) = For sending emails programmatically via Mailtrap Email API
  - SMTP Credentials (username/password) = For Supabase Auth to send confirmation/reset emails
  - **You need both** for full functionality

- **Sandbox vs Production**:
  - Use `sandbox.smtp.mailtrap.io` for testing (emails don't actually send)
  - Use `smtp.mailtrap.io` for production (emails actually send)

- **Ports**:
  - `2525` = Default (no encryption)
  - `587` = TLS (recommended for production)
  - `465` = SSL

---

## Troubleshooting

### Emails Not Arriving in Mailtrap?

1. **Check Mailtrap Inbox**: Make sure you're checking the correct inbox
2. **Verify Credentials**: Double-check username/password in Mailtrap dashboard
3. **Check Port**: Try different ports (2525, 587, 465)
4. **Check Supabase Settings**: Ensure email provider is enabled in Auth settings

### Still Having Issues?

- Mailtrap Support: https://mailtrap.io/help
- Supabase Auth Docs: https://supabase.com/docs/guides/auth/auth-smtp

