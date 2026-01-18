# Mailtrap SMTP Configuration for Supabase Auth

## Why SMTP Configuration is Needed

Supabase Auth needs SMTP credentials to send:
- Email confirmation links
- Password reset emails
- Magic link emails
- Other authentication-related emails

**Note**: The Mailtrap API token (`5d62b8d34572f8b966abe4734f8aa6df`) is different from SMTP credentials. You need **both**:
- **API Token**: For sending transactional emails via Mailtrap Email API (already configured)
- **SMTP Credentials**: For Supabase Auth to send confirmation/reset emails (needs to be configured in Supabase Dashboard)

---

## Steps to Configure SMTP

### 1. Get SMTP Credentials from Mailtrap

1. Go to: https://mailtrap.io/inboxes
2. Select the inbox you want to use for testing
3. Click on **"SMTP Settings"** tab (or **"Integration"** → **"SMTP"**)
4. Copy the credentials:
   - **Host**: `sandbox.smtp.mailtrap.io` (for testing) or `smtp.mailtrap.io` (for production)
   - **Port**: `2525` (default) or `587` (TLS) or `465` (SSL)
   - **Username**: (shown in dashboard, e.g., `abc123def456`)
   - **Password**: (shown in dashboard, e.g., `xyz789uvw012`)

### 2. Configure in Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/cwvaodyhtwcmbfglqwmk/auth/smtp
2. Toggle **"Enable Custom SMTP"** to **ON**
3. Enter the Mailtrap SMTP credentials:
   - **SMTP Host**: `sandbox.smtp.mailtrap.io` (or `smtp.mailtrap.io`)
   - **SMTP Port**: `2525` (or `587` for TLS)
   - **SMTP User**: (your Mailtrap username)
   - **SMTP Password**: (your Mailtrap password)
   - **Sender Email**: `no-reply@hoadaoofficial.com` (or your preferred sender)
   - **Sender Name**: `HoadaoOfficial`
4. Click **"Save"**

### 3. Test SMTP Configuration

After saving:
1. Try to sign up a test user in your app
2. Check your Mailtrap inbox - you should see the confirmation email there
3. If emails arrive in Mailtrap inbox, SMTP is working correctly! ✅

---

## Troubleshooting

### Emails Not Arriving?

1. **Check Mailtrap Inbox**: Make sure you're checking the correct inbox
2. **Verify SMTP Credentials**: Double-check username/password in Mailtrap dashboard
3. **Check Port**: Try different ports (2525, 587, 465)
4. **Check Supabase Auth Settings**: Make sure email provider is enabled

### Still Having Issues?

- Mailtrap support: https://mailtrap.io/help
- Supabase Auth docs: https://supabase.com/docs/guides/auth/auth-smtp

