import { google } from 'googleapis'
import { readFileSync } from 'fs'
import { join } from 'path'

interface SheetRow {
  date: string | null // Column A
  time: string | null // Column B
  location: string | null // Column C
  rowNumber: number
}

interface ParsedEvent {
  date: string // ISO date string (YYYY-MM-DD)
  dayOfWeek: string | null // "Saturday", "Sunday", etc.
  time: string | null // "TBA" or "HH:mm" format
  location: string | null
  sheetRowNumber: number
}

/**
 * Initialize Google Sheets API client using service account
 * Reads credentials from either:
 * 1. A JSON file (GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY_PATH) - Recommended
 * 2. Environment variable (GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY) - Fallback
 */
function getSheetsClient() {
  // Option 1: Read from JSON file (recommended - no escaping issues)
  const keyFilePath = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY_PATH
  
  let serviceAccountKey: any

  if (keyFilePath) {
    // Read from file
    try {
      const fullPath = join(process.cwd(), keyFilePath)
      let keyFileContent = readFileSync(fullPath, 'utf-8')
      
      // Remove BOM and trim whitespace
      keyFileContent = keyFileContent.replace(/^\uFEFF/, '').trim()
      
      serviceAccountKey = JSON.parse(keyFileContent)
    } catch (error) {
      throw new Error(
        `Failed to read Google service account key from file (${keyFilePath}): ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  } else {
    // Option 2: Fallback to environment variable (legacy support)
    const serviceAccountKeyStr = process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY
    
    if (!serviceAccountKeyStr) {
      throw new Error(
        'Missing Google Sheets service account credentials. ' +
        'Set either GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY_PATH (path to JSON file) or ' +
        'GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY (JSON string)'
      )
    }

    try {
      // Remove surrounding quotes if present
      let jsonStr = serviceAccountKeyStr.trim()
      if ((jsonStr.startsWith('"') && jsonStr.endsWith('"')) || 
          (jsonStr.startsWith("'") && jsonStr.endsWith("'"))) {
        jsonStr = jsonStr.slice(1, -1)
      }
      
      // Unescape quotes for JSON parsing
      jsonStr = jsonStr.replace(/\\"/g, '"')
      
      serviceAccountKey = JSON.parse(jsonStr)
    } catch (error) {
      throw new Error(
        `Invalid GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY: ${error instanceof Error ? error.message : 'Must be valid JSON'}. ` +
        'Consider using GOOGLE_SHEETS_SERVICE_ACCOUNT_KEY_PATH instead (point to a JSON file)'
      )
    }
  }

  // Get email from key file or environment variable
  const serviceAccountEmail = serviceAccountKey.client_email || process.env.GOOGLE_SHEETS_SERVICE_ACCOUNT_EMAIL

  if (!serviceAccountEmail) {
    throw new Error('Missing Google Sheets service account email')
  }

  const auth = new google.auth.JWT({
    email: serviceAccountEmail,
    key: serviceAccountKey.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  })

  return google.sheets({ version: 'v4', auth })
}

/**
 * Fetch data from Google Sheet
 */
export async function fetchSheetData(): Promise<SheetRow[]> {
  const sheetId = process.env.GOOGLE_SHEET_ID
  const range = process.env.GOOGLE_SHEET_RANGE || 'Schedule!A:C'

  if (!sheetId) {
    throw new Error('Missing GOOGLE_SHEET_ID environment variable')
  }

  const sheets = getSheetsClient()

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range,
    })

    const rows = response.data.values || []

    // Convert to SheetRow format (skip header row if present)
    const dataRows = rows.slice(1).map((row, index) => ({
      date: row[0] || null, // Column A
      time: row[1] || null, // Column B
      location: row[2] || null, // Column C
      rowNumber: index + 2, // +2 because we skip header and 1-based index
    }))

    return dataRows.filter((row) => row.date || row.time || row.location) // Filter empty rows
  } catch (error) {
    console.error('Error fetching Google Sheet data:', error)
    throw new Error(`Failed to fetch sheet data: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Parse date string from format "01/31- Saturday" to { date: "2026-01-31", dayOfWeek: "Saturday" }
 * Assumes year 2026 for all dates
 */
export function parseDateString(dateStr: string): { date: string; dayOfWeek: string | null } {
  if (!dateStr || typeof dateStr !== 'string') {
    throw new Error('Invalid date string')
  }

  // Pattern: "01/31- Saturday" or "01/31-Saturday" or "01/31- Saturday (Note)"
  const match = dateStr.match(/^(\d{1,2})\/(\d{1,2})(?:\s*-\s*([A-Za-z]+))?/i)

  if (!match) {
    throw new Error(`Unable to parse date string: ${dateStr}`)
  }

  const month = parseInt(match[1], 10)
  const day = parseInt(match[2], 10)
  const dayOfWeek = match[3] || null

  // Validate month and day
  if (month < 1 || month > 12 || day < 1 || day > 31) {
    throw new Error(`Invalid date: ${month}/${day}`)
  }

  // Assume year 2026
  const year = 2026
  const date = new Date(year, month - 1, day)
  const isoDate = date.toISOString().split('T')[0] // YYYY-MM-DD format

  return {
    date: isoDate,
    dayOfWeek: dayOfWeek ? dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1).toLowerCase() : null,
  }
}

/**
 * Parse location string, removing content in parentheses
 * Example: "Saigon Mall (40 mins)" → "Saigon Mall"
 */
export function parseLocation(locationStr: string): string {
  if (!locationStr || typeof locationStr !== 'string') {
    return ''
  }

  // Remove everything in parentheses and trim
  return locationStr.replace(/\s*\([^)]*\)\s*/g, '').trim()
}

/**
 * Normalize time string
 * - Keep "TBA" as-is (return as string)
 * - Parse "11:15 AM" to "11:15" format (24-hour if needed, but keep as-is for now)
 * - Return null for empty strings
 */
export function normalizeTime(timeStr: string | null): string | null {
  if (!timeStr || typeof timeStr !== 'string') {
    return null
  }

  const trimmed = timeStr.trim()

  // Keep "TBA" as-is
  if (trimmed.toUpperCase() === 'TBA') {
    return 'TBA'
  }

  // Try to parse time format like "11:15 AM" or "11:15 PM"
  const timeMatch = trimmed.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i)

  if (timeMatch) {
    let hours = parseInt(timeMatch[1], 10)
    const minutes = timeMatch[2]
    const period = timeMatch[3]?.toUpperCase()

    if (period === 'PM' && hours !== 12) {
      hours += 12
    } else if (period === 'AM' && hours === 12) {
      hours = 0
    }

    // Return in HH:mm format (24-hour)
    return `${hours.toString().padStart(2, '0')}:${minutes}`
  }

  // If it doesn't match expected format, return as-is (might be other formats)
  return trimmed
}

/**
 * Parse all sheet rows into ParsedEvent format
 * Handles multi-row dates where only the first row has the date, and subsequent rows share that date
 */
export async function parseSheetData(): Promise<ParsedEvent[]> {
  const rows = await fetchSheetData()

  const parsedEvents: ParsedEvent[] = []

  // Pattern to identify valid date strings (e.g., "01/31", "01/31- Saturday")
  const datePattern = /^\d{1,2}\/\d{1,2}/i

  // Track the current date as we iterate through rows
  // When a row has a date, update currentDate. When it doesn't, use the last known date
  let currentDate: string | null = null
  let currentDayOfWeek: string | null = null

  for (const row of rows) {
    try {
      // Skip rows that have no data at all (no date, time, or location)
      if (!row.date && !row.time && !row.location) {
        continue
      }

      // Check if this row has a valid date in column A
      if (row.date && datePattern.test(row.date)) {
        // This row has a date - parse it and update currentDate for subsequent rows
        try {
          const parsed = parseDateString(row.date)
          currentDate = parsed.date
          currentDayOfWeek = parsed.dayOfWeek
        } catch (error) {
          console.warn(`Row ${row.rowNumber}: Invalid date format "${row.date}": ${error instanceof Error ? error.message : 'Unknown error'}`)
          // Don't update currentDate if parsing fails - keep using the last valid date
        }
      }

      // Skip rows that don't have time or location data (we need at least one to create an event)
      // Also skip if we haven't encountered any date yet
      if (!currentDate || (!row.time && !row.location)) {
        // If row has date but it's not a valid date pattern, log warning but continue
        if (row.date && !datePattern.test(row.date)) {
          console.warn(`Skipping row ${row.rowNumber}: Column A doesn't match date pattern and row has no time/location: "${row.date}"`)
        }
        continue
      }

      // Parse time and location
      const time = normalizeTime(row.time)
      const location = row.location ? parseLocation(row.location) : null

      // Create event using currentDate (from this row if it had a date, or from previous row)
      parsedEvents.push({
        date: currentDate,
        dayOfWeek: currentDayOfWeek,
        time,
        location,
        sheetRowNumber: row.rowNumber,
      })
    } catch (error) {
      console.warn(`Error parsing row ${row.rowNumber}:`, error)
      // Continue processing other rows
    }
  }

  return parsedEvents
}

