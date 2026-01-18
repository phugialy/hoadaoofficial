# Auth Configuration Instructions

## Current Status

✅ **Database Migration**: Successfully applied - new columns (`day_of_week`, `google_sheet_row_number`, `synced_at`) are now in the events table

✅ **Email Confirmations**: Enabled by default on hosted Supabase projects

⏳ **SMTP Configuration**: Needs to be done manually in Dashboard

## SMTP Configuration Steps

### Option 1: Via Supabase Dashboard (Recommended)

1. Navigate to: https://supabase.com/dashboard/project/cwvaodyhtwcmbfglqwmk/auth/smtp

2. Enable "Enable Custom SMTP"

3. Enter Mailtrap.io SMTP credentials:
   - **SMTP Host**: `smtp.mailtrap.io`
   - **SMTP Port**: `2525` (or `587` for TLS)
   - **SMTP User**: Your Mailtrap username
   - **SMTP Password**: Your Mailtrap password
   - **Sender Email**: `no-reply@hoadaoofficial.com` (or your preferred sender)
   - **Sender Name**: `HoadaoOfficial`

4. Click "Save"

### Option 2: Via Management API

If you have a Supabase Access Token:

```bash
# Get your access token from https://supabase.com/dashboard/account/tokens
export SUPABASE_ACCESS_TOKEN="your-access-token"
export PROJECT_REF="cwvaodyhtwcmbfglqwmk"

# Configure custom SMTP
curl -X PATCH "https://api.supabase.com/v1/projects/$PROJECT_REF/config/auth" \
  -H "Authorization: Bearer $SUPABASE_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "external_email_enabled": true,
    "mailer_secure_email_change_enabled": true,
    "mailer_autoconfirm": false,
    "smtp_admin_email": "no-reply@hoadaoofficial.com",
    "smtp_host": "smtp.mailtrap.io",
    "smtp_port": 2525,
    "smtp_user": "your-mailtrap-username",
    "smtp_pass": "your-mailtrap-password",
    "smtp_sender_name": "HoadaoOfficial"
  }'
```

## Mailtrap.io Setup

### API Token (for sending transactional emails via API)

✅ **API Token**: `5d62b8d34572f8b966abe4734f8aa6df` - Verified and working

This token is for sending emails via Mailtrap's Email API (already set up in `src/lib/services/mailtrapService.ts`)

**Test the API**: You can send a test email by calling:
```bash
POST http://localhost:3000/api/test/mailtrap
# Or use curl:
curl -X POST http://localhost:3000/api/test/mailtrap \
  -H "Content-Type: application/json" \
  -d '{"to": "bigpstudio@gmail.com"}'
```

### SMTP Credentials (for Supabase Auth)

For Supabase Auth SMTP configuration, you need **SMTP credentials** (different from API token):

1. Sign up at https://mailtrap.io (if not already done)
2. Go to your **Inbox** at https://mailtrap.io/inboxes
3. Select the inbox you want to use for testing
4. Click on **"SMTP Settings"** tab
5. Copy the SMTP credentials:
   - **Host**: `sandbox.smtp.mailtrap.io` (for testing) or `smtp.mailtrap.io` (for production)
   - **Port**: `2525` (default) or `587` (TLS)
   - **Username**: (shown in SMTP Settings - usually something like `12345678abcdefgh`)
   - **Password**: (shown in SMTP Settings - usually something like `12345678abcdefgh`)

**Note**: The API token (`5d62b8d34572f8b966abe4734f8aa6df`) is different from SMTP username/password. You need both:
- **API Token**: For sending emails programmatically via Mailtrap Email API
- **SMTP Credentials**: For Supabase Auth to send confirmation/reset emails

## Create Admin User

You have two options to create the admin user:

### Option 1: Via API Endpoint (Recommended)

Call the admin user creation API endpoint (requires `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`):

```bash
curl -X POST http://localhost:3000/api/admin/create-admin-user \
  -H "Content-Type: application/json"
```

Or in browser/Postman:
- URL: `POST http://localhost:3000/api/admin/create-admin-user`
- This will create the user with email `bigpstudio@gmail.com`, password `hoadaoliondance.com`, and `is_admin: true` metadata

### Option 2: Via Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/cwvaodyhtwcmbfglqwmk/auth/users
2. Click "Add User" → "Create new user"
3. Enter:
   - Email: `bigpstudio@gmail.com`
   - Password: `hoadaoliondance.com`
   - Auto Confirm User: ✅ (check this to skip email confirmation for initial setup)
4. After user is created, update user metadata:
   - Go to the user's details page
   - In "User Metadata" section, add:
     ```json
     {
       "is_admin": true
     }
     ```
   - Or use SQL via Supabase SQL Editor:
     ```sql
     UPDATE auth.users 
     SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
     WHERE email = 'bigpstudio@gmail.com';
     ```

## Verify Configuration

1. Test email sending by attempting to sign up a test user
2. Check Mailtrap inbox to see if confirmation email arrives
3. Test admin login at `/admin/login`

## Notes

- Email confirmations are **enabled by default** on hosted Supabase projects
- The default SMTP service only sends to team member emails - you MUST configure custom SMTP for production
- Rate limit: 30 emails/hour with custom SMTP (can be adjusted in Rate Limits settings)

