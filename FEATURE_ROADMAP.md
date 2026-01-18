# Feature Roadmap
## Visual Implementation Guide

## 🎯 Core Features Overview

```
┌─────────────────────────────────────────────────────────┐
│                    PLATFORM FEATURES                     │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   EVENTS     │  │   CALENDAR   │  │    TEAM      │  │
│  │              │  │              │  │              │  │
│  │ • List       │  │ • Month View │  │ • Profiles   │  │
│  │ • Details    │  │ • Week View  │  │ • Grid       │  │
│  │ • Filter     │  │ • Day View   │  │ • Details    │  │
│  │ • Search     │  │ • Highlights │  │ • Social     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   MEDIA      │  │    HOME      │  │   ADMIN      │  │
│  │              │  │              │  │              │  │
│  │ • Gallery    │  │ • Hero       │  │ • Upload     │  │
│  │ • Carousel   │  │ • Featured   │  │ • Manage     │  │
│  │ • Videos     │  │ • Preview    │  │ • Edit       │  │
│  │ • Images     │  │ • CTAs       │  │ • Delete     │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Feature Breakdown

### 1. Home Page
**Priority**: High (MVP)
**Components Needed**:
- Hero section (full-screen, video/image)
- Featured events section
- Upcoming events preview
- Team preview
- Call-to-action sections

**Status**: ⬜ Not Started

---

### 2. Events System
**Priority**: High (MVP)
**Features**:
- [ ] Events list page
- [ ] Event detail page
- [ ] Event cards (red/gold theme)
- [ ] Event filtering (category, date)
- [ ] Event search
- [ ] Event creation (admin)
- [ ] Event editing (admin)

**Database Tables**:
- `events` table
- `calendar_entries` table (if recurring)

**Status**: ⬜ Not Started

---

### 3. Calendar System
**Priority**: High (MVP)
**Features**:
- [ ] Calendar view (month/week/day)
- [ ] Event indicators on dates
- [ ] Today highlight
- [ ] Chinese New Year date highlighting
- [ ] Event click to view details
- [ ] Responsive (list view on mobile)

**Components**:
- EventCalendar component
- Calendar navigation
- Event popup/modal

**Status**: ⬜ Not Started

---

### 4. Team Section
**Priority**: High (MVP)
**Features**:
- [ ] Team list page
- [ ] Team member cards
- [ ] Team member detail pages
- [ ] Team grid layout (responsive)
- [ ] Filter by role (optional)
- [ ] Social links display

**Database Tables**:
- `team_members` table

**Status**: ⬜ Not Started

---

### 5. Media Gallery
**Priority**: High (MVP)
**Features**:
- [ ] Gallery page
- [ ] Media grid (images/videos)
- [ ] Media carousel (featured)
- [ ] Lightbox/modal viewer
- [ ] Lazy loading
- [ ] Image optimization
- [ ] Video player

**Storage**:
- Supabase Storage bucket: `media`

**Status**: ⬜ Not Started

---

### 6. Media Upload (Admin)
**Priority**: Medium
**Features**:
- [ ] Upload page/component
- [ ] Drag & drop upload
- [ ] File validation
- [ ] Progress indicator
- [ ] Upload to Supabase Storage
- [ ] Save metadata to database
- [ ] Bulk upload (optional)

**Status**: ⬜ Not Started

---

### 7. Search Functionality
**Priority**: Medium
**Features**:
- [ ] Search bar component
- [ ] Search API route
- [ ] Full-text search (Supabase)
- [ ] Search results page
- [ ] Search filters
- [ ] Search across events, team, media

**Status**: ⬜ Not Started

---

### 8. Animations
**Priority**: Medium
**Features**:
- [ ] Confetti explosion
- [ ] Firecracker burst
- [ ] Lion dance animations
- [ ] Scroll animations
- [ ] Hover effects
- [ ] Page transitions

**Status**: ⬜ Not Started

---

## 🗄️ Database Schema

### Events Table
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

### Team Members Table
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

### Media Gallery Table
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

---

## 🎨 Component Checklist

### Layout Components
- [ ] MainLayout
- [ ] Navigation (mobile + desktop)
- [ ] Footer
- [ ] Container

### Hero Components
- [ ] ChineseNewYearHero
- [ ] SplitHero
- [ ] CenteredHero

### Event Components
- [ ] EventCard
- [ ] EventList
- [ ] EventDetail
- [ ] EventFilter
- [ ] EventSearch

### Calendar Components
- [ ] EventCalendar
- [ ] CalendarView (month/week/day)
- [ ] CalendarNavigation

### Team Components
- [ ] TeamMemberCard
- [ ] TeamGrid
- [ ] TeamMemberDetail

### Media Components
- [ ] MediaGrid
- [ ] MediaCarousel
- [ ] MediaLightbox
- [ ] VideoPlayer

### Common Components
- [ ] Button (themed variants)
- [ ] Card
- [ ] Loading
- [ ] Error
- [ ] Modal

---

## 📱 Pages Checklist

### Public Pages
- [ ] Home (`/`)
- [ ] Events List (`/events`)
- [ ] Event Detail (`/events/[id]`)
- [ ] Calendar (`/calendar`)
- [ ] Team (`/team`)
- [ ] Team Member (`/team/[id]`)
- [ ] Gallery (`/gallery`)

### Admin Pages (Optional)
- [ ] Admin Dashboard (`/admin`)
- [ ] Upload Media (`/admin/upload`)
- [ ] Manage Events (`/admin/events`)
- [ ] Manage Team (`/admin/team`)

---

## 🔌 API Routes Checklist

### Events API
- [ ] `GET /api/events` - List all events
- [ ] `GET /api/events/[id]` - Get single event
- [ ] `POST /api/events` - Create event (admin)
- [ ] `PUT /api/events/[id]` - Update event (admin)
- [ ] `DELETE /api/events/[id]` - Delete event (admin)

### Team API
- [ ] `GET /api/team` - List all team members
- [ ] `GET /api/team/[id]` - Get single member
- [ ] `POST /api/team` - Create member (admin)
- [ ] `PUT /api/team/[id]` - Update member (admin)

### Media API
- [ ] `GET /api/media` - List all media
- [ ] `GET /api/media/[id]` - Get single media
- [ ] `POST /api/upload` - Upload media (admin)
- [ ] `DELETE /api/media/[id]` - Delete media (admin)

### Search API
- [ ] `GET /api/search?q=query` - Search across content

---

## 🎯 MVP Scope (Minimum Viable Product)

### Must Have
- ✅ Home page with hero
- ✅ Events list and detail
- ✅ Calendar view
- ✅ Team section
- ✅ Media gallery
- ✅ Responsive design
- ✅ Basic animations

### Can Wait
- ⏸️ Admin panel (use Supabase dashboard initially)
- ⏸️ Advanced search
- ⏸️ User authentication
- ⏸️ Real-time updates
- ⏸️ PWA features

---

## 📊 Progress Tracking

### Overall Progress
```
Foundation:        [░░░░░░░░░░] 0%
Core Features:     [░░░░░░░░░░] 0%
Styling:           [░░░░░░░░░░] 0%
Animations:        [░░░░░░░░░░] 0%
Polish:            [░░░░░░░░░░] 0%
────────────────────────────────────
Total:             [░░░░░░░░░░] 0%
```

### Feature Completion
- Home Page: 0%
- Events: 0%
- Calendar: 0%
- Team: 0%
- Media: 0%
- Search: 0%
- Animations: 0%

---

*Feature roadmap for tracking implementation progress.*  
*Update as features are completed.*  
*Last updated: [Date]*


