# Getting Started Guide
## Quick Start for Development

## ✅ Prerequisites Check

### Infrastructure
- [x] Vercel account created
- [x] Supabase project created
- [x] Vercel MCP configured
- [x] Supabase MCP configured

### Development Tools
- [ ] Node.js 18+ installed
- [ ] npm or pnpm installed
- [ ] Git installed
- [ ] VS Code (or preferred IDE)

---

## 🚀 Step 1: Initialize Project (30 minutes)

### 1.1 Create Next.js Project
```bash
npx create-next-app@latest . --typescript --tailwind --app --use-npm
```

### 1.2 Install Dependencies
```bash
# Core dependencies
npm install @supabase/supabase-js @tanstack/react-query
npm install date-fns zod react-hook-form @hookform/resolvers

# Development dependencies
npm install -D eslint prettier @types/node
```

### 1.3 Set Up Environment Variables
Create `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key
```

---

## 🗄️ Step 2: Database Setup (30 minutes)

### 2.1 Create Database Schema
Use Supabase MCP or Dashboard to create tables:

**Events Table**:
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  location TEXT,
  category TEXT CHECK (category IN ('daily', 'weekly', 'special')),
  image_url TEXT,
  video_url TEXT,
  public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Team Members Table**:
```sql
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  bio TEXT,
  image_url TEXT,
  social_links JSONB,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Media Gallery Table**:
```sql
CREATE TABLE media_gallery (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT CHECK (type IN ('image', 'video')) NOT NULL,
  storage_path TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  title TEXT,
  description TEXT,
  event_id UUID REFERENCES events(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Set Up Supabase Storage
- Create bucket: `media`
- Set public read access
- Create folders: `events/`, `team/`, `gallery/`

---

## 🎨 Step 3: Configure Theme (15 minutes)

### 3.1 Update Tailwind Config
Edit `tailwind.config.ts`:
```typescript
export default {
  theme: {
    extend: {
      colors: {
        red: {
          500: '#C8102E',  // Primary
          600: '#b91c1c',
          700: '#991b1b',
        },
        gold: {
          500: '#FFD700',  // Secondary
          600: '#d97706',
          700: '#b45309',
        },
      },
    },
  },
}
```

### 3.2 Create Supabase Client
Create `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
```

---

## 📦 Step 4: Project Structure (15 minutes)

### 4.1 Create Folders
```bash
mkdir -p src/components/{common,media,calendar,team,hero,layout}
mkdir -p src/app/api/{events,team,media,upload}
mkdir -p src/lib/{services,utils}
mkdir -p src/types
mkdir -p src/hooks
mkdir -p src/contexts
```

### 4.2 Create Base Files
- `src/lib/supabase.ts` - Supabase client
- `src/types/index.ts` - TypeScript types
- `src/components/layout/MainLayout.tsx` - Main layout
- `src/components/navigation/Navigation.tsx` - Navigation

---

## 🎯 Step 5: First Feature - Home Page (2 hours)

### 5.1 Create Hero Component
- Use `COMPONENT_STYLING_REFERENCE.md` for code examples
- Apply Chinese New Year theme (red/gold)
- Make responsive

### 5.2 Create Home Page
- Add hero section
- Add placeholder sections
- Test on mobile/desktop

### 5.3 Deploy to Vercel
```bash
vercel
```
Or push to GitHub (auto-deploys)

---

## 📚 Next Steps

1. **Read**: `IMPLEMENTATION_TODO.md` for complete checklist
2. **Follow**: `SPRINT_PLAN.md` for organized development
3. **Track**: `FEATURE_ROADMAP.md` for progress
4. **Reference**: `COMPONENT_STYLING_REFERENCE.md` for code examples

---

## 🛠️ Useful Commands

### Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run linter
```

### Supabase (via MCP or CLI)
```bash
supabase db pull     # Pull schema
supabase db push     # Push changes
supabase db diff     # Show differences
```

### Vercel (via MCP or CLI)
```bash
vercel               # Deploy
vercel env add       # Add env var
vercel logs          # View logs
```

---

## 📖 Documentation Reference

### For Development
- `DEVELOPMENT_RULES.md` - Coding standards
- `QUICK_REFERENCE.md` - Daily workflow
- `COMPONENT_STYLING_REFERENCE.md` - Component examples

### For Design
- `DESIGN_TOKENS.md` - Design tokens
- `CULTURAL_THEME_GUIDE.md` - Theme guide
- `UI_ANIMATIONS_GUIDE.md` - Animations

### For Infrastructure
- `INFRASTRUCTURE_SIMPLIFIED.md` - Current stack
- `ARCHITECTURE_DESIGN.md` - Architecture details

---

*Quick start guide to get you coding immediately.*  
*See IMPLEMENTATION_TODO.md for detailed steps.*  
*Last updated: [Date]*


