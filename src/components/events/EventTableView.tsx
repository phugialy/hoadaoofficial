'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import type { Event } from '@/types'

export default function EventTableView() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/events?months=2')
      if (!response.ok) {
        throw new Error('Failed to fetch events')
      }
      const data = await response.json()
      setEvents(data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load events')
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM d, yyyy')
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return format(date, 'h:mm a')
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

  if (events.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">No events found for the next 2 months.</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
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
                Event Title
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => {
              const eventDate = new Date(event.start_date)
              const timeStr = eventDate.toTimeString().slice(0, 5)
              const isTBA = timeStr === '00:00' || !timeStr

              return (
                <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {formatDate(event.start_date)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {event.day_of_week || format(eventDate, 'EEEE')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {isTBA ? 'TBA' : formatTime(event.start_date)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {event.location || 'TBA'}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {event.title}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile view (responsive) */}
      <div className="md:hidden p-4 space-y-4">
        {events.map((event) => {
          const eventDate = new Date(event.start_date)
          const timeStr = eventDate.toTimeString().slice(0, 5)
          const isTBA = timeStr === '00:00' || !timeStr

          return (
            <div key={event.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-2">
                <div className="font-semibold text-gray-900">{event.title}</div>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Date:</span>
                  <span className="text-gray-600">{formatDate(event.start_date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Day:</span>
                  <span className="text-gray-600">{event.day_of_week || format(eventDate, 'EEEE')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700">Time:</span>
                  <span className="text-gray-600">{isTBA ? 'TBA' : formatTime(event.start_date)}</span>
                </div>
                {event.location && (
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Location:</span>
                    <span className="text-gray-600">{event.location}</span>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

