'use client'

import { useState } from 'react'
import ConflictResolutionDialog from './ConflictResolutionDialog'

interface ConflictEvent {
  sheetRowNumber: number
  sheetData: {
    date: string
    dayOfWeek: string | null
    time: string | null
    location: string | null
  }
  dbData: {
    id: string
    start_date: string
    location: string | null
    day_of_week: string | null
    google_sheet_row_number: number | null
  } | null
  conflictType: 'new' | 'modified' | 'missing'
}

export default function SyncSheetButton() {
  const [loading, setLoading] = useState(false)
  const [conflicts, setConflicts] = useState<ConflictEvent[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [syncStatus, setSyncStatus] = useState<string | null>(null)

  const handleSync = async () => {
    setLoading(true)
    setSyncStatus(null)
    setConflicts([])

    try {
      // Call sync API
      const response = await fetch('/api/admin/sync-sheet', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        // Try to get detailed error message from response
        const errorMsg = data.errors && data.errors.length > 0 
          ? data.errors.join(', ')
          : `Failed to sync from Google Sheet (${response.status})`
        throw new Error(errorMsg)
      }

      if (data.conflicts && data.conflicts.length > 0) {
        // Show conflict resolution dialog
        setConflicts(data.conflicts)
        setShowDialog(true)
      } else {
        setSyncStatus(`Sync successful! ${data.parsed || 0} rows processed with no conflicts.`)
        // Refresh the page after successful sync to show new events
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      }
    } catch (error) {
      setSyncStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`)
      console.error('Sync error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResolve = async (
    resolutions: Array<{
      rowNumber: number
      action: 'useSheet' | 'keepDb' | 'skip'
      sheetData?: any
      eventId?: string
    }>
  ) => {
    setLoading(true)
    setShowDialog(false)

    try {
      const response = await fetch('/api/admin/sync-sheet', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ resolutions }),
      })

      if (!response.ok) {
        throw new Error('Failed to apply resolutions')
      }

      const data = await response.json()

      if (data.errors && data.errors.length > 0) {
        setSyncStatus(`Applied ${data.applied || 0} changes. Errors: ${data.errors.join(', ')}`)
      } else {
        setSyncStatus(`Successfully applied ${data.applied || 0} resolutions.`)
        // Refresh the page after successful sync to show new events
        setTimeout(() => {
          window.location.reload()
        }, 1000)
      }
    } catch (error) {
      setSyncStatus(`Error applying resolutions: ${error instanceof Error ? error.message : 'Unknown error'}`)
      console.error('Resolve error:', error)
    } finally {
      setLoading(false)
      setConflicts([])
    }
  }

  return (
    <>
      <div className="mb-4">
        <button
          onClick={handleSync}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          {loading ? 'Syncing...' : 'Sync from Google Sheet'}
        </button>

        {syncStatus && (
          <div
            className={`mt-2 p-3 rounded ${
              syncStatus.includes('Error') ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'
            }`}
          >
            {syncStatus}
          </div>
        )}
      </div>

      <ConflictResolutionDialog
        conflicts={conflicts}
        open={showDialog}
        onClose={() => {
          setShowDialog(false)
          setConflicts([])
        }}
        onResolve={handleResolve}
      />
    </>
  )
}

