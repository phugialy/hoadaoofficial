'use client'

import { useState } from 'react'

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

interface ConflictResolutionDialogProps {
  conflicts: ConflictEvent[]
  open: boolean
  onClose: () => void
  onResolve: (resolutions: Array<{ rowNumber: number; action: 'useSheet' | 'keepDb' | 'skip'; sheetData?: any; eventId?: string }>) => void
}

type ResolutionAction = 'useSheet' | 'keepDb' | 'skip'

export default function ConflictResolutionDialog({
  conflicts,
  open,
  onClose,
  onResolve,
}: ConflictResolutionDialogProps) {
  const [resolutions, setResolutions] = useState<Record<number, ResolutionAction>>(() => {
    const initial: Record<number, ResolutionAction> = {}
    conflicts.forEach((conflict) => {
      // Default: use sheet for new, keep DB for modified
      initial[conflict.sheetRowNumber] = conflict.conflictType === 'new' ? 'useSheet' : 'keepDb'
    })
    return initial
  })

  if (!open || conflicts.length === 0) return null

  const handleActionChange = (rowNumber: number, action: ResolutionAction) => {
    setResolutions((prev) => ({
      ...prev,
      [rowNumber]: action,
    }))
  }

  const handleApply = () => {
    const resolutionList = conflicts.map((conflict) => ({
      rowNumber: conflict.sheetRowNumber,
      action: resolutions[conflict.sheetRowNumber] || 'skip',
      sheetData: conflict.sheetData,
      eventId: conflict.dbData?.id,
    }))

    onResolve(resolutionList)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  }

  const formatTime = (timeStr: string | null) => {
    if (!timeStr || timeStr === 'TBA') return timeStr || 'N/A'
    return timeStr
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-red-600">Resolve Conflicts</h2>
          <p className="text-gray-600 mt-1">Found {conflicts.length} conflict(s). Choose how to resolve each one.</p>
        </div>

        <div className="p-6 space-y-4">
          {conflicts.map((conflict) => {
            const resolution = resolutions[conflict.sheetRowNumber] || 'skip'

            return (
              <div key={conflict.sheetRowNumber} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">Row {conflict.sheetRowNumber}</h3>
                  <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-sm">
                    {conflict.conflictType === 'new' ? 'New Event' : 'Modified'}
                  </span>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Sheet Data */}
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <h4 className="font-semibold text-blue-700 mb-2">From Google Sheet</h4>
                    <div className="space-y-1 text-sm">
                      <p>
                        <span className="font-medium">Date:</span> {formatDate(conflict.sheetData.date)}
                      </p>
                      <p>
                        <span className="font-medium">Day:</span> {conflict.sheetData.dayOfWeek || 'N/A'}
                      </p>
                      <p>
                        <span className="font-medium">Time:</span> {formatTime(conflict.sheetData.time)}
                      </p>
                      <p>
                        <span className="font-medium">Location:</span> {conflict.sheetData.location || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* DB Data */}
                  <div className="bg-purple-50 p-3 rounded border border-purple-200">
                    <h4 className="font-semibold text-purple-700 mb-2">
                      {conflict.dbData ? 'Current Database' : 'Not in Database'}
                    </h4>
                    {conflict.dbData ? (
                      <div className="space-y-1 text-sm">
                        <p>
                          <span className="font-medium">Date:</span> {formatDate(conflict.dbData.start_date)}
                        </p>
                        <p>
                          <span className="font-medium">Day:</span> {conflict.dbData.day_of_week || 'N/A'}
                        </p>
                        <p>
                          <span className="font-medium">Time:</span>{' '}
                          {formatTime(
                            conflict.dbData.start_date
                              ? new Date(conflict.dbData.start_date).toTimeString().slice(0, 5)
                              : null
                          )}
                        </p>
                        <p>
                          <span className="font-medium">Location:</span> {conflict.dbData.location || 'N/A'}
                        </p>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-600">No existing event found</p>
                    )}
                  </div>
                </div>

                {/* Resolution Options */}
                <div className="flex gap-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name={`resolution-${conflict.sheetRowNumber}`}
                      value="useSheet"
                      checked={resolution === 'useSheet'}
                      onChange={() => handleActionChange(conflict.sheetRowNumber, 'useSheet')}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-blue-700">Use Sheet</span>
                  </label>
                  {conflict.dbData && (
                    <label className="flex items-center ml-4">
                      <input
                        type="radio"
                        name={`resolution-${conflict.sheetRowNumber}`}
                        value="keepDb"
                        checked={resolution === 'keepDb'}
                        onChange={() => handleActionChange(conflict.sheetRowNumber, 'keepDb')}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-purple-700">Keep DB</span>
                    </label>
                  )}
                  <label className="flex items-center ml-4">
                    <input
                      type="radio"
                      name={`resolution-${conflict.sheetRowNumber}`}
                      value="skip"
                      checked={resolution === 'skip'}
                      onChange={() => handleActionChange(conflict.sheetRowNumber, 'skip')}
                      className="mr-2"
                    />
                    <span className="text-sm font-medium text-gray-700">Skip</span>
                  </label>
                </div>
              </div>
            )
          })}
        </div>

        <div className="p-6 border-t flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors font-semibold"
          >
            Apply Resolutions
          </button>
        </div>
      </div>
    </div>
  )
}

