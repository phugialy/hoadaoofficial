'use client'

import React, { useEffect, useState } from 'react'
import { format, addMonths } from 'date-fns'
import type { Event } from '@/types'
import { createBrowserClient } from '@/lib/supabase'

interface EditableEvent extends Event {
  editing?: boolean
  editedData?: {
    start_date?: string
    day_of_week?: string | null
    location?: string | null
    public?: boolean
  }
}

export default function AdminCalendar() {
  const [events, setEvents] = useState<EditableEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const supabase = createBrowserClient()

      // Fetch all events (admin can see all, including private)
      const { data, error: fetchError } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true })

      if (fetchError) throw fetchError

      // Type assertion for Supabase query result
      const eventsData = (data || []) as Event[]

      console.log('[AdminCalendar] Fetched events:', eventsData.length)
      if (eventsData.length > 0) {
        console.log('[AdminCalendar] First event:', {
          id: eventsData[0].id,
          start_date: eventsData[0].start_date,
          title: eventsData[0].title,
        })
      }
      
      setEvents(eventsData as EditableEvent[])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id === eventId) {
          return {
            ...event,
            editing: true,
            editedData: {
              start_date: event.start_date,
              day_of_week: event.day_of_week || null,
              location: event.location || null,
              public: event.public ?? false,
            },
          }
        }
        return event
      })
    )
  }

  const handleCancelEdit = (eventId: string) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id === eventId) {
          const { editing, editedData, ...rest } = event
          return rest
        }
        return event
      })
    )
  }

  const handleSave = async (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    if (!event || !event.editedData) return

    try {
      const supabase = createBrowserClient()

      // Use the edited start_date directly (it's already an ISO string from setDateTime)
      const dateStr = event.editedData.start_date
      if (!dateStr) {
        throw new Error('Start date is required')
      }

      console.log('[AdminCalendar] Saving event:', {
        eventId,
        originalDate: event.start_date,
        editedDate: dateStr,
        editedData: event.editedData,
      })

      const updateData = {
        day_of_week: event.editedData.day_of_week || null,
        location: event.editedData.location || null,
        start_date: dateStr, // Already an ISO string from setDateTime
        public: event.editedData.public ?? event.public,
      }

      const { error: updateError } = await (supabase
        .from('events') as any)
        .update(updateData)
        .eq('id', eventId)

      if (updateError) {
        console.error('[AdminCalendar] Update error:', updateError)
        throw updateError
      }

      console.log('[AdminCalendar] Event saved successfully')

      // Refresh events
      await fetchEvents()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save event')
      console.error('Error saving event:', err)
    }
  }

  const handleChange = (eventId: string, field: string, value: string | boolean) => {
    setEvents((prev) =>
      prev.map((event) => {
        if (event.id === eventId && event.editedData) {
          return {
            ...event,
            editedData: {
              ...event.editedData,
              [field]: value,
            },
          }
        }
        return event
      })
    )
  }

  // Quick toggle public status without entering edit mode
  const handleTogglePublic = async (eventId: string, currentPublic: boolean) => {
    try {
      const supabase = createBrowserClient()
      const { error } = await (supabase
        .from('events') as any)
        .update({ public: !currentPublic })
        .eq('id', eventId)

      if (error) throw error

      // Refresh events
      await fetchEvents()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to toggle public status')
      console.error('Error toggling public status:', err)
    }
  }

  // Bulk action: Make all visible events public
  const handleMakeAllPublic = async () => {
    if (!confirm(`Make all ${upcomingEvents.length} events public?`)) {
      return
    }

    try {
      const supabase = createBrowserClient()
      const eventIds = upcomingEvents.map((e) => e.id)

      // Update all events at once
      const { error } = await (supabase
        .from('events') as any)
        .update({ public: true })
        .in('id', eventIds)

      if (error) throw error

      // Refresh events
      await fetchEvents()
      alert(`Successfully made ${eventIds.length} events public!`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to make all events public')
      console.error('Error making all events public:', err)
    }
  }

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'yyyy-MM-dd')
  }

  const formatDisplayDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM d, yyyy')
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return format(date, 'HH:mm')
  }

  const setDateTime = (dateStr: string, timeStr: string) => {
    // dateStr is in yyyy-MM-dd format from date input
    // timeStr is in HH:mm format (24-hour)
    const [year, month, day] = dateStr.split('-').map(Number)
    const date = new Date(Date.UTC(year, month - 1, day))
    
    if (timeStr) {
      const [hours, minutes] = timeStr.split(':').map(Number)
      // Convert to local time, then create ISO string
      const localDate = new Date(year, month - 1, day, hours, minutes)
      return localDate.toISOString()
    }
    
    return date.toISOString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading events...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-red-600">Error: {error}</div>
      </div>
    )
  }

  // For admin view: show all future events (no date limit)
  // Compare dates by day only (ignore time) to avoid timezone issues
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()) // Start of today in local time
  
  const upcomingEvents = events.filter((event) => {
    const eventDate = new Date(event.start_date)
    // Create date at start of day for comparison (avoid timezone/time issues)
    // Use UTC methods to avoid timezone shifts
    const eventDay = new Date(Date.UTC(eventDate.getUTCFullYear(), eventDate.getUTCMonth(), eventDate.getUTCDate()))
    const todayUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
    return eventDay >= todayUTC // Show all future events (including today)
  })

  // Group events by date
  const eventsByDate = upcomingEvents.reduce((acc, event) => {
    const eventDate = new Date(event.start_date)
    const dateKey = formatDate(event.start_date) // yyyy-MM-dd format for grouping
    if (!acc[dateKey]) {
      acc[dateKey] = []
    }
    acc[dateKey].push(event)
    return acc
  }, {} as Record<string, EditableEvent[]>)

  // Sort dates chronologically
  const sortedDates = Object.keys(eventsByDate).sort()
  
  console.log('[AdminCalendar] Filtering events:', {
    totalEvents: events.length,
    upcomingEvents: upcomingEvents.length,
    groupedDates: sortedDates.length,
    todayUTC: new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())).toISOString(),
  })
  
  // Alternative: Filter to next 2 months (comment out above and uncomment below)
  // const twoMonthsFromNow = addMonths(now, 2)
  // const upcomingEvents = events.filter((event) => {
  //   const eventDate = new Date(event.start_date)
  //   return eventDate >= now && eventDate <= twoMonthsFromNow
  // })

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
        {upcomingEvents.length > 0 && (
          <button
            onClick={handleMakeAllPublic}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            title="Make all visible events public"
          >
            Make All Public
          </button>
        )}
      </div>

      {sortedDates.length === 0 ? (
        <div className="text-center py-12 text-gray-600">No events found for the next 2 months.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day of Week
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Public
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedDates.map((dateKey) => {
                const dateEvents = eventsByDate[dateKey]
                const firstEvent = dateEvents[0]
                const displayDate = formatDisplayDate(firstEvent.start_date)
                const dayOfWeek = firstEvent.day_of_week || format(new Date(firstEvent.start_date), 'EEEE')
                
                return dateEvents.map((event, index) => (
                  <tr 
                    key={event.id} 
                    className={`hover:bg-gray-50 ${index === 0 ? 'border-t-2 border-gray-300' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {index === 0 ? (
                        // Show date only for first event in group
                        <span className="text-sm font-semibold text-gray-900">{displayDate}</span>
                      ) : (
                        // Empty for subsequent events in same day
                        <span className="text-sm text-gray-400">└</span>
                      )}
                      {event.editing && (
                        <div className="mt-1">
                          <input
                            type="date"
                            value={formatDate(event.editedData!.start_date!)}
                            onChange={(e) => {
                              const newDate = e.target.value
                              const currentTime = formatTime(event.editedData!.start_date || event.start_date)
                              handleChange(event.id, 'start_date', setDateTime(newDate, currentTime))
                            }}
                            className="border rounded px-2 py-1 text-sm"
                          />
                        </div>
                      )}
                    </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {event.editing ? (
                      <input
                        type="text"
                        value={event.editedData!.day_of_week || ''}
                        onChange={(e) => handleChange(event.id, 'day_of_week', e.target.value)}
                        placeholder="e.g., Saturday"
                        className="border rounded px-2 py-1 text-sm w-32"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">{event.day_of_week || 'N/A'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {event.editing ? (
                      <input
                        type="time"
                        value={formatTime(event.editedData!.start_date || event.start_date)}
                        onChange={(e) =>
                          handleChange(
                            event.id,
                            'start_date',
                            setDateTime(formatDate(event.editedData!.start_date!), e.target.value)
                          )
                        }
                        className="border rounded px-2 py-1 text-sm"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">
                        {formatTime(event.start_date) === '00:00' ? 'TBA' : format(new Date(event.start_date), 'h:mm a')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {event.editing ? (
                      <input
                        type="text"
                        value={event.editedData!.location || ''}
                        onChange={(e) => handleChange(event.id, 'location', e.target.value)}
                        placeholder="Location"
                        className="border rounded px-2 py-1 text-sm w-full"
                      />
                    ) : (
                      <span className="text-sm text-gray-600">{event.location || 'N/A'}</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-gray-900">{event.title}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {event.editing ? (
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={event.editedData!.public ?? false}
                          onChange={(e) => handleChange(event.id, 'public', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm text-gray-700">Public</span>
                      </label>
                    ) : (
                      <button
                        onClick={() => handleTogglePublic(event.id, event.public)}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          event.public
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={event.public ? 'Click to make private' : 'Click to make public'}
                      >
                        {event.public ? '✓ Public' : 'Private'}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {event.editing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSave(event.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => handleCancelEdit(event.id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(event.id)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
                ))
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

