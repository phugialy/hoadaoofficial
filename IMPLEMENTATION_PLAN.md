# Implementation Plan
## HoadaoOfficial - Vietnamese Lion Dance Cultural Organization

## Overview

This plan consolidates all implementation priorities for building a Vietnamese cultural organization platform with Google Sheets sync, admin calendar management, and public event display.

## Current Status

- ✅ Next.js 14+ project initialized with TypeScript
- ✅ Tailwind CSS configured with Chinese New Year theme (Red #C8102E, Gold #FFD700)
- ✅ Database schema created (`supabase/schema.sql`)
- ✅ Basic layout and navigation components
- ✅ Supabase client configuration (`src/lib/supabase.ts`)
- ⏳ **Ready for feature implementation**

---

## Priority Features (In Order)

### 1. Vietnamese Language Support
**Goal**: Ensure backend and frontend properly handle Vietnamese text (Telex/VNI input methods)

#### 1.1 Font Configuration
- **File**: `src/app/layout.tsx`
- **Change**: Update Inter font to include Vietnamese subset
  ```typescript
  // Current: Inter({ subsets: ['latin'] })
  // Updated: Inter({ subsets: ['latin', 'vietnamese'] })
  ```
- **Rationale**: Ensures proper rendering of Vietnamese diacritics (ă, â, ê, ô, ơ, ư, đ)

#### 1.2 HTML Language Attribute
- **File**: `src/app/layout.tsx`
- **Change**: Update `<html lang="en">` to `<html lang="vi">`
- **Rationale**: Proper language declaration for browsers, screen readers, SEO

#### 1.3 Encoding Verification
- Verify Supabase database uses UTF-8 encoding (default for Supabase)
- Test Vietnamese text storage and retrieval
- Ensure API responses use UTF-8 charset

**Note**: No translation or parsing needed - all Vietnamese text is manual entry by admins

---

### 2. Admin Authentication System
**Goal**: Admin-only authentication with email confirmation using Mailtrap.io

#### 2.1 Supabase Auth Configuration
- Configure Supabase Auth to require email confirmation
- Set up Mailtrap.io SMTP credentials in Supabase Auth settings
- Configure email templates for confirmation links

#### 2.2 Environment Variables
- **File**: `.env.local`
- **Variables**:
  ```env
  # Existing Supabase vars
  NEXT_PUBLIC_SUPABASE_URL=
  NEXT_PUBLIC_SUPABASE_ANON_KEY=
  SUPABASE_SERVICE_ROLE_KEY=
  
  # Mailtrap.io SMTP (for Supabase Auth config - set in Supabase Dashboard)
  # Not needed in .env.local, configured in Supabase Auth settings
  ```

#### 2.3 Admin User Creation
- Create initial admin user in Supabase:
  - Email: `bigpstudio@gmail.com`
  - Password: `hoadaoliondance.com`
  - Manually set admin role/flag in database

#### 2.4 Authentication Components
- **Files to create**:
  - `src/app/admin/login/page.tsx` - Login page
  - `src/components/auth/LoginForm.tsx` - Login form component
  - `src/lib/auth/adminAuth.ts` - Admin authentication utilities
  - `src/middleware.ts` - Route protection for `/admin/*`

#### 2.5 Admin Role Management
- Add `is_admin` field to `auth.users` metadata or create separate `admin_users` table
- Update RLS policies to check admin status
- Admin-only routes: `/admin/*`

---

### 3. Database Schema Updates
**Goal**: Support Google Sheets sync with day-of-week and conflict tracking

#### 3.1 Events Table Updates
- **File**: `supabase/schema.sql`
- **Add fields to `events` table**:
  ```sql
  ALTER TABLE events 
    ADD COLUMN IF NOT EXISTS day_of_week VARCHAR(20), -- "Saturday", "Sunday", etc.
    ADD COLUMN IF NOT EXISTS google_sheet_row_number INTEGER, -- Track source row
    ADD COLUMN IF NOT EXISTS synced_at TIMESTAMPTZ; -- Last sync timestamp
  ```

#### 3.2 Sync History Table (Optional - for audit trail)
- Create `event_sync_history` table for tracking changes
  ```sql
  CREATE TABLE IF NOT EXISTS event_sync_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    sync_type VARCHAR(20) CHECK (sync_type IN ('sheet', 'manual', 'conflict')),
    sheet_data JSONB, -- Original sheet data
    db_data JSONB, -- DB state before sync
    resolved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
  );
  ```

#### 3.3 Indexes
- Add indexes for sync queries:
  ```sql
  CREATE INDEX IF NOT EXISTS idx_events_sheet_row ON events(google_sheet_row_number);
  CREATE INDEX IF NOT EXISTS idx_events_day_of_week ON events(day_of_week);
  ```

#### 3.4 Update TypeScript Types
- **File**: `src/types/index.ts`
- Update `Event` interface to include new fields:
  ```typescript
  export interface Event {
    // ... existing fields
    day_of_week?: string | null;
    google_sheet_row_number?: number | null;
    synced_at?: string | null;
  }
  ```

---

### 4. Google Sheets Integration
**Goal**: Read-only sync from Google Sheet to Supabase database

#### 4.1 Google Sheets Configuration
- **Sheet Details**:
  - Sheet ID: `1Meik15ONRTI1K_M76tg83ehD4niFrSMo7N6rlgLBWMo`
  - Sheet Name: `Schedule`
  - Service Account Email: `id-025hoadaoquery@hoadaoposts.iam.gserviceaccount.com`
  
#### 4.2 Environment Variables
- **File**: `.env.local`
- **Variables**:
  ```env
  GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL=id-025hoadaoquery@hoadaoposts.iam.gserviceaccount.com
  GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY={"type":"service_account",...} # Full JSON key
  GOOGLE_SHEET_ID=1Meik15ONRTI1K_M76tg83ehD4niFrSMo7N6rlgLBWMo
  GOOGLE_SHEET_RANGE=Schedule!A:C # Column A (Dates), B (Times), C (Location)
  ```

#### 4.3 Google Sheets Service
- **File**: `src/lib/services/googleSheetsService.ts`
- **Functions**:
  - `fetchSheetData()` - Read data from Google Sheet
  - `parseDateString(dateStr: string)` - Parse "01/31- Saturday" format
  - `parseLocation(locationStr: string)` - Strip parentheses content
  - `normalizeTime(timeStr: string)` - Handle "TBA" vs time values

#### 4.4 Data Parsing Logic
- **Date Parsing**: Extract date and day-of-week from Column A
  - Format: "01/31- Saturday" → Date: "2026-01-31", Day: "Saturday"
  - Multi-row dates: Handle multiple events on same date
  - Year assumption: 2026 for all dates
  - Timezone: `America/Dallas` for local time handling

- **Time Parsing**: Column B
  - Keep "TBA" as-is (not null)
  - Parse time strings like "11:15 AM"
  - Convert to 24-hour format for storage

- **Location Parsing**: Column C
  - Ignore content in parentheses: "Saigon Mall (40 mins)" → "Saigon Mall"

#### 4.5 Sync API Endpoint
- **File**: `src/app/api/admin/sync-sheet/route.ts`
- **Function**: Manual trigger sync from admin UI
- **Process**:
  1. Fetch data from Google Sheet
  2. Parse each row into event data
  3. Check for existing events by `google_sheet_row_number` or date/time/location
  4. Detect conflicts (Sheet data differs from DB)
  5. Return conflicts for admin resolution
  6. Apply sync after conflict resolution

#### 4.6 Conflict Resolution System
- **Conflict Detection**: Compare Sheet data with DB data
- **Conflict Resolution UI**: Modal/dialog for each conflict row
  - Show Sheet version vs DB version
  - Options: "Use Sheet", "Keep DB", "Skip"
- **Resolution Logic**: Store resolution choice in sync history

---

### 5. Admin Calendar Page
**Goal**: Calendar display for admins to view and manage events

#### 5.1 Admin Calendar Route
- **File**: `src/app/admin/calendar/page.tsx`
- **Features**:
  - Calendar view (month/week/day)
  - Event indicators on dates
  - Click events to view/edit details
  - "Sync from Google Sheet" button

#### 5.2 Calendar Component
- **File**: `src/components/admin/AdminCalendar.tsx`
- **Features**:
  - Full calendar grid with Vietnamese date formatting
  - Event dots/badges on dates
  - Navigation (prev/next month)
  - Responsive design (mobile-friendly)

#### 5.3 Event Management UI
- **Row-level editing**:
  - Edit date, day-of-week, time, location
  - "Save" button at end of each row
  - Inline editing with validation
- **Display**: Date and Day-of-week in separate columns

#### 5.4 Sync Button Component
- **File**: `src/components/admin/SyncSheetButton.tsx`
- **Features**:
  - Trigger sync from Google Sheet
  - Show sync progress/status
  - Handle conflict resolution dialog
  - Success/error notifications

---

### 6. Public Events Page
**Goal**: Display events for public with Calendar and Table views

#### 6.1 Events Page Route
- **File**: `src/app/events/page.tsx`
- **Features**:
  - Two tabs: "Calendar View" and "Table View"
  - Filter: Next 2 months of events
  - Responsive design (mobile/desktop)

#### 6.2 Calendar View Tab
- **File**: `src/components/events/EventCalendarView.tsx`
- **Features**:
  - Calendar grid with event indicators
  - Click events to see details
  - Navigate between months
  - Show only public events (`public = true`)
  - Display events from current date + 2 months

#### 6.3 Table View Tab
- **File**: `src/components/events/EventTableView.tsx`
- **Features**:
  - Table with columns: Date | Day of Week | Time | Location | Event Title
  - Sortable columns
  - Filter: Next 2 months
  - Responsive table (stack on mobile)
  - Vietnamese text support

#### 6.4 Events API
- **File**: `src/app/api/events/route.ts` (already exists, may need updates)
- **Endpoints**:
  - `GET /api/events` - List all public events
  - `GET /api/events?months=2` - Next 2 months filter
  - `GET /api/events/[id]` - Single event details

---

### 7. Edge Functions & Performance (Future Enhancement)
**Goal**: Optimize data fetching and processing using Supabase Edge Functions

#### 7.1 Edge Functions Setup
- Create Edge Functions for:
  - Optimized event queries with caching
  - Google Sheets sync processing
  - Image/video optimization before storage

#### 7.2 Database Indexing
- Already defined in `schema.sql`:
  - `idx_events_start_date`
  - `idx_events_category`
  - `idx_events_public`
  - Add: `idx_events_sheet_row`, `idx_events_day_of_week`

#### 7.3 Media Optimization
- Implement image optimization for Supabase Storage
- Video transcoding (future)
- CDN configuration for media delivery

---

## Implementation Order

### Week 1: Foundation & Vietnamese Support
1. ✅ Update font to include Vietnamese subset
2. ✅ Update HTML lang attribute to "vi"
3. ✅ Verify UTF-8 encoding support
4. ✅ Update database schema (add day_of_week, google_sheet_row_number)
5. ✅ Update TypeScript types

### Week 2: Admin Authentication
1. Configure Supabase Auth with Mailtrap.io SMTP
2. Create admin login page and components
3. Implement route protection for `/admin/*`
4. Create initial admin user
5. Test authentication flow

### Week 3: Google Sheets Sync
1. Set up Google Sheets service account integration
2. Create Google Sheets service (`googleSheetsService.ts`)
3. Implement data parsing logic (date, time, location)
4. Create sync API endpoint (`/api/admin/sync-sheet`)
5. Implement conflict detection and resolution UI

### Week 4: Admin Calendar & Public Events
1. Create admin calendar page (`/admin/calendar`)
2. Build calendar component with event display
3. Implement row-level editing for events
4. Create public events page (`/events`)
5. Build Calendar View and Table View tabs
6. Test end-to-end flow (Sheet → Sync → Admin → Public)

---

## Technical Decisions

### Data Flow
```
Google Sheet (Source of Truth)
  ↓ (Manual Sync Button)
Sync API Endpoint
  ↓ (Parse & Detect Conflicts)
Conflict Resolution UI (if needed)
  ↓ (Save to DB)
Supabase Database
  ↓ (Query with filters)
Admin Calendar Page (View/Edit)
  ↓ (Mark as public)
Public Events Page (Calendar/Table View)
```

### Conflict Resolution Strategy
- **Per-row resolution**: Each conflicting row gets individual dialog
- **Options**: Use Sheet, Keep DB, Skip
- **History**: Track resolution in `event_sync_history` table
- **No bulk override**: Preserve manual admin edits

### Vietnamese Text Handling
- **No translation**: All Vietnamese text is manual entry
- **UTF-8 throughout**: Database, API, frontend all use UTF-8
- **Font support**: Inter with Vietnamese subset
- **Input methods**: Telex and VNI work naturally in browser input fields

### Timezone Handling
- Store all dates/times in UTC in database
- Convert to `America/Dallas` timezone for display
- Use `date-fns-tz` or similar for timezone conversions

---

## Files to Create/Update

### New Files
- `src/app/admin/login/page.tsx`
- `src/app/admin/calendar/page.tsx`
- `src/app/events/page.tsx`
- `src/components/auth/LoginForm.tsx`
- `src/components/admin/AdminCalendar.tsx`
- `src/components/admin/SyncSheetButton.tsx`
- `src/components/admin/ConflictResolutionDialog.tsx`
- `src/components/events/EventCalendarView.tsx`
- `src/components/events/EventTableView.tsx`
- `src/lib/auth/adminAuth.ts`
- `src/lib/services/googleSheetsService.ts`
- `src/app/api/admin/sync-sheet/route.ts`
- `src/middleware.ts`

### Files to Update
- `src/app/layout.tsx` - Font subset, lang attribute
- `src/types/index.ts` - Add new Event fields
- `supabase/schema.sql` - Add day_of_week, google_sheet_row_number, sync_history
- `.env.local` - Google Sheets credentials
- `src/app/api/events/route.ts` - Add months filter

---

## Testing Checklist

### Vietnamese Language Support
- [ ] Test Vietnamese text input (Telex/VNI)
- [ ] Verify font renders Vietnamese diacritics correctly
- [ ] Test Vietnamese text in Google Sheets sync
- [ ] Verify Vietnamese text displays correctly in all views

### Admin Authentication
- [ ] Test admin login with email/password
- [ ] Verify email confirmation flow (Mailtrap)
- [ ] Test route protection (redirect non-admins)
- [ ] Verify admin can access `/admin/*` routes

### Google Sheets Sync
- [ ] Test sheet data fetching
- [ ] Verify date parsing (with day-of-week)
- [ ] Test time parsing ("TBA" vs actual times)
- [ ] Test location parsing (strip parentheses)
- [ ] Test conflict detection
- [ ] Test conflict resolution (all three options)

### Admin Calendar
- [ ] Test calendar display with events
- [ ] Test row-level editing (date, time, location)
- [ ] Verify save functionality
- [ ] Test sync button trigger

### Public Events Page
- [ ] Test Calendar View with events
- [ ] Test Table View with events
- [ ] Verify "next 2 months" filter
- [ ] Test responsive design (mobile/desktop)
- [ ] Verify only public events display

---

## Environment Variables Summary

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Google Sheets
GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL=id-025hoadaoquery@hoadaoposts.iam.gserviceaccount.com
GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
GOOGLE_SHEET_ID=1Meik15ONRTI1K_M76tg83ehD4niFrSMo7N6rlgLBWMo
GOOGLE_SHEET_RANGE=Schedule!A:C

# Mailtrap.io (configured in Supabase Auth settings, not .env.local)
```

---

## Next Steps

1. **Immediate**: Update Vietnamese language support (font, lang attribute)
2. **Week 1**: Set up admin authentication with Mailtrap
3. **Week 2**: Implement Google Sheets sync with conflict resolution
4. **Week 3**: Build admin calendar and public events pages
5. **Week 4**: Testing, refinement, and deployment preparation

---

*Last updated: Based on all conversation decisions and priorities*

