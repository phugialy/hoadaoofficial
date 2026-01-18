# Setup Guide

## Quick Start (First Time Setup)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Supabase

#### Option A: Using Supabase Dashboard
1. Go to [supabase.com](https://supabase.com) and create a new project
2. Go to **SQL Editor** in your Supabase dashboard
3. Copy and paste the contents of `supabase/schema.sql`
4. Run the SQL script

#### Option B: Using Supabase CLI (if installed)
```bash
supabase db push
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

**Where to find these values:**
- Go to your Supabase project dashboard
- Navigate to **Settings** → **API**
- Copy:
  - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
  - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

### 4. Set Up Supabase Storage

1. Go to **Storage** in your Supabase dashboard
2. Create buckets:
   - `media` - for images and videos
   - `team` - for team member photos
   - `events` - for event images

3. Set bucket policies (make public read access):
   - Go to each bucket → **Policies**
   - Create policy: "Public read access"
   - Policy: `SELECT` for `authenticated` and `anon` roles

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Next Steps

1. ✅ Project initialized
2. ✅ Dependencies installed
3. ⏳ Set up Supabase database (run schema.sql)
4. ⏳ Configure environment variables
5. ⏳ Set up Supabase Storage buckets
6. ⏳ Test the application

## Troubleshooting

### Supabase Connection Issues
- Verify your `.env.local` file has correct values
- Check that your Supabase project is active
- Ensure RLS policies are set correctly

### TypeScript Errors
- Run `npm run type-check` to see all type errors
- Make sure all dependencies are installed

### Build Errors
- Clear `.next` folder: `rm -rf .next` (or `Remove-Item -Recurse -Force .next` on Windows)
- Reinstall dependencies: `rm -rf node_modules && npm install`

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Type checking
npm run type-check

# Linting
npm run lint
```


