import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { parseSheetData } from '@/lib/services/googleSheetsService'
import type { Event } from '@/types'
import { startOfDay, endOfDay } from 'date-fns'

interface ConflictEvent {
  sheetRowNumber: number
  sheetData: {
    date: string
    dayOfWeek: string | null
    time: string | null
    location: string | null
  }
  dbData: Event | null
  conflictType: 'new' | 'modified' | 'missing'
}

interface SyncResponse {
  success: boolean
  parsed: number
  conflicts: ConflictEvent[]
  errors?: string[]
}

/**
 * POST /api/admin/sync-sheet
 * Syncs events from Google Sheet to database
 * Returns conflicts that need resolution
 */
export async function POST(request: NextRequest) {
  try {
    // Parse sheet data
    const sheetEvents = await parseSheetData()

    if (sheetEvents.length === 0) {
      return NextResponse.json<SyncResponse>({
        success: true,
        parsed: 0,
        conflicts: [],
      })
    }

    const supabase = createServerClient()
    const conflicts: ConflictEvent[] = []

    // Check each sheet event against database
    for (const sheetEvent of sheetEvents) {
      // Find existing event by google_sheet_row_number or date/time/location match
      let existingEvent: Event | null = null

      // First, try to find by google_sheet_row_number
      if (sheetEvent.sheetRowNumber) {
        const { data: rowMatch } = await supabase
          .from('events')
          .select('*')
          .eq('google_sheet_row_number', sheetEvent.sheetRowNumber)
          .single()

        if (rowMatch) {
          existingEvent = rowMatch as Event
        }
      }

      // If not found by row number, try to match by date, time, and location
      if (!existingEvent && sheetEvent.date && sheetEvent.time && sheetEvent.location) {
        const eventDate = new Date(sheetEvent.date)
        const dayStart = startOfDay(eventDate)
        const dayEnd = endOfDay(eventDate)

        const { data: dateMatches } = await supabase
          .from('events')
          .select('*')
          .gte('start_date', dayStart.toISOString())
          .lte('start_date', dayEnd.toISOString())
          .eq('location', sheetEvent.location)

        if (dateMatches && dateMatches.length > 0) {
          // Find best match by time
          const foundEvent = dateMatches.find((e) => {
            if (!e.start_date) return false
            const dbTime = new Date(e.start_date).toTimeString().slice(0, 5) // HH:mm format
            return dbTime === sheetEvent.time
          })

          existingEvent = foundEvent ? (foundEvent as Event) : null

          if (!existingEvent && dateMatches.length === 1) {
            existingEvent = dateMatches[0] as Event
          }
        }
      }

      // Determine conflict type
      if (!existingEvent) {
        // New event - no conflict, but track for potential creation
        conflicts.push({
          sheetRowNumber: sheetEvent.sheetRowNumber,
          sheetData: {
            date: sheetEvent.date,
            dayOfWeek: sheetEvent.dayOfWeek,
            time: sheetEvent.time,
            location: sheetEvent.location,
          },
          dbData: null,
          conflictType: 'new',
        })
      } else {
        // Check if data differs (conflict)
        const dbDate = new Date(existingEvent.start_date).toISOString().split('T')[0]
        const dbTime = existingEvent.start_date
          ? new Date(existingEvent.start_date).toTimeString().slice(0, 5)
          : null

        const dateChanged = dbDate !== sheetEvent.date
        const timeChanged =
          (sheetEvent.time === 'TBA' && dbTime !== null) ||
          (sheetEvent.time !== 'TBA' && sheetEvent.time !== dbTime)
        const locationChanged = existingEvent.location !== sheetEvent.location
        const dayOfWeekChanged = existingEvent.day_of_week !== sheetEvent.dayOfWeek

        if (dateChanged || timeChanged || locationChanged || dayOfWeekChanged) {
          conflicts.push({
            sheetRowNumber: sheetEvent.sheetRowNumber,
            sheetData: {
              date: sheetEvent.date,
              dayOfWeek: sheetEvent.dayOfWeek,
              time: sheetEvent.time,
              location: sheetEvent.location,
            },
            dbData: existingEvent,
            conflictType: 'modified',
          })
        }
      }
    }

    return NextResponse.json<SyncResponse>({
      success: true,
      parsed: sheetEvents.length,
      conflicts,
    })
  } catch (error) {
    console.error('Sync error details:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorStack = error instanceof Error ? error.stack : undefined
    
    // Log full error details for debugging
    if (errorStack) {
      console.error('Error stack:', errorStack)
    }
    
    return NextResponse.json<SyncResponse>(
      {
        success: false,
        parsed: 0,
        conflicts: [],
        errors: [errorMessage],
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/sync-sheet
 * Applies resolved conflicts to database
 * Body: { resolutions: [{ rowNumber, action: 'useSheet' | 'keepDb' | 'skip', eventId? }] }
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { resolutions } = body

    if (!Array.isArray(resolutions)) {
      return NextResponse.json({ error: 'Invalid request: resolutions must be an array' }, { status: 400 })
    }

    const supabase = createServerClient()
    const errors: string[] = []
    let successCount = 0

    for (const resolution of resolutions) {
      const { rowNumber, action, sheetData, eventId } = resolution

      if (action === 'skip') {
        continue
      }

      try {
        if (action === 'useSheet' && sheetData) {
          // Create or update event with sheet data
          const eventDate = new Date(sheetData.date)
          const startDate = sheetData.time && sheetData.time !== 'TBA'
            ? new Date(`${sheetData.date}T${sheetData.time}:00`)
            : new Date(sheetData.date)

          const eventData = {
            start_date: startDate.toISOString(),
            location: sheetData.location,
            day_of_week: sheetData.dayOfWeek,
            google_sheet_row_number: rowNumber,
            synced_at: new Date().toISOString(),
            // Set default values for required fields
            title: `Event ${sheetData.date}`,
            category: 'weekly' as const,
            public: false, // Start as private, admin can make public
          }

          if (eventId) {
            // Update existing event
            const { error } = await supabase
              .from('events')
              .update(eventData)
              .eq('id', eventId)

            if (error) throw error
            successCount++
          } else {
            // Create new event
            const { error } = await supabase.from('events').insert(eventData)

            if (error) throw error
            successCount++
          }
        } else if (action === 'keepDb') {
          // Just update synced_at timestamp
          if (eventId) {
            const { error } = await supabase
              .from('events')
              .update({ synced_at: new Date().toISOString() })
              .eq('id', eventId)

            if (error) throw error
            successCount++
          }
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error'
        errors.push(`Row ${rowNumber}: ${errorMsg}`)
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      applied: successCount,
      errors: errors.length > 0 ? errors : undefined,
    })
  } catch (error) {
    console.error('Apply sync error:', error)
    return NextResponse.json(
      {
        success: false,
        applied: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred'],
      },
      { status: 500 }
    )
  }
}

