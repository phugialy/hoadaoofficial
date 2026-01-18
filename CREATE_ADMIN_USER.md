# Create Admin User - Quick Guide

## Option 1: Using Node.js Script (Recommended if you have Node.js)

Run this script directly:

```bash
node scripts/create-admin-user.mjs
```

This script uses your `SUPABASE_SERVICE_ROLE_KEY` from `.env.local` to create the admin user via Supabase Admin API.

**Prerequisites:**
- Node.js installed
- `.env.local` file with `SUPABASE_SERVICE_ROLE_KEY` set
- `@supabase/supabase-js` package installed (already in your dependencies)

## Option 2: Using API Endpoint (if your Next.js dev server is running)

If `npm run dev` is running:

```bash
curl -X POST http://localhost:3000/api/admin/create-admin-user \
  -H "Content-Type: application/json"
```

Or in PowerShell:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/admin/create-admin-user" -Method Post -ContentType "application/json"
```

## Option 3: Using MCP Supabase (SQL-based - Not Recommended)

Unfortunately, **MCP Supabase tools cannot directly create auth users** because:
- They focus on database operations (SQL execution, tables, migrations)
- Auth user creation requires Supabase Auth API which handles password hashing
- Direct SQL inserts into `auth.users` are complex and not recommended

**However**, I can use MCP to check if the user exists after creation:

```sql
SELECT id, email, raw_user_meta_data, email_confirmed_at 
FROM auth.users 
WHERE email = 'bigpstudio@gmail.com';
```

## Option 4: Via Supabase Dashboard (Manual)

1. Go to: https://supabase.com/dashboard/project/cwvaodyhtwcmbfglqwmk/auth/users
2. Click "Add User" → "Create new user"
3. Enter:
   - Email: `bigpstudio@gmail.com`
   - Password: `hoadaoliondance.com`
   - Auto Confirm User: ✅
4. After creation, update metadata via SQL Editor:
   ```sql
   UPDATE auth.users 
   SET raw_user_meta_data = raw_user_meta_data || '{"is_admin": true}'::jsonb
   WHERE email = 'bigpstudio@gmail.com';
   ```

## Recommendation

**Use Option 1 (Node.js script)** - it's the most straightforward and handles both creation and metadata update automatically.

