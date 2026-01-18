// Event types
export interface Event {
  id: string
  title: string
  description: string | null
  start_date: string
  end_date: string | null
  location: string | null
  category: 'daily' | 'weekly' | 'special'
  image_url: string | null
  video_url: string | null
  public: boolean
  day_of_week?: string | null
  google_sheet_row_number?: number | null
  synced_at?: string | null
  created_at: string
  updated_at: string
}

// Team member types
export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string | null
  image_url: string | null
  social_links: Record<string, string> | null
  display_order: number
  created_at: string
  updated_at: string
}

// Media gallery types
export interface MediaItem {
  id: string
  type: 'image' | 'video'
  storage_path: string
  url: string
  thumbnail_url: string | null
  title: string | null
  description: string | null
  event_id: string | null
  created_at: string
}

// Calendar entry types
export interface CalendarEntry {
  id: string
  event_id: string
  date: string
  time: string | null
  recurring_pattern: Record<string, unknown> | null
}


