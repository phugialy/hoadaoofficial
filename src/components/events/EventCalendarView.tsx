'use client'

import { useEffect, useState } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths } from 'date-fns'
import type { Event } from '@/types'

export default function EventCalendarView() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvents, setSelectedEvents] = useState<Event[]>([])

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

  const getEventsForDate = (date: Date): Event[] => {
    return events.filter((event) => {
      const eventDate = new Date(event.start_date)
      return isSameDay(eventDate, date)
    })
  }

  const handleDayClick = (day: Date) => {
    const dayEvents = getEventsForDate(day)
    if (dayEvents.length > 0) {
      setSelectedDate(day)
      setSelectedEvents(dayEvents)
    }
  }

  const closeModal = () => {
    setSelectedDate(null)
    setSelectedEvents([])
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })

  // Get first day of week for the month
  const firstDayOfWeek = monthStart.getDay()
  const emptyDays = Array(firstDayOfWeek).fill(null)

  const handlePrevMonth = () => {
    setCurrentDate((prev) => {
      const newDate = addMonths(prev, -1)
      // Don't go before current month
      const now = new Date()
      if (newDate < startOfMonth(now)) {
        return prev
      }
      return newDate
    })
  }

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = addMonths(prev, 1)
      // Don't go more than 2 months ahead
      const twoMonthsFromNow = addMonths(new Date(), 2)
      if (newDate > endOfMonth(twoMonthsFromNow)) {
        return prev
      }
      return newDate
    })
  }

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

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

  return (
    <div className="bg-white rounded-lg shadow p-6">
      {/* Calendar Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={handlePrevMonth}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          disabled={startOfMonth(currentDate) <= startOfMonth(new Date())}
        >
          ← Prev
        </button>
        <h2 className="text-2xl font-bold text-gray-800">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <button
          onClick={handleNextMonth}
          className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded transition-colors"
          disabled={endOfMonth(currentDate) >= endOfMonth(addMonths(new Date(), 2))}
        >
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {/* Day Names */}
        {dayNames.map((day) => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}

        {/* Empty days at start of month */}
        {emptyDays.map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square"></div>
        ))}

        {/* Days of month */}
        {daysInMonth.map((day) => {
          const dayEvents = getEventsForDate(day)
          const isToday = isSameDay(day, new Date())
          const isPast = day < new Date() && !isToday

          return (
            <div
              key={day.toISOString()}
              onClick={() => handleDayClick(day)}
              className={`aspect-square border rounded-lg p-2 transition-colors ${
                dayEvents.length > 0
                  ? 'cursor-pointer hover:shadow-md'
                  : ''
              } ${
                isToday
                  ? 'bg-red-50 border-red-500'
                  : isPast
                  ? 'bg-gray-50 border-gray-200'
                  : 'bg-white border-gray-200 hover:border-red-300'
              }`}
            >
              <div
                className={`text-sm font-medium mb-1 ${
                  isToday ? 'text-red-600' : isPast ? 'text-gray-400' : 'text-gray-700'
                }`}
              >
                {format(day, 'd')}
              </div>
              {dayEvents.length > 0 && (
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs bg-red-500 text-white px-1 py-0.5 rounded truncate"
                      title={`${event.location || event.title} - ${event.start_date ? format(new Date(event.start_date), 'h:mm a') : 'TBA'}`}
                    >
                      {event.location || event.title || 'Event'}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500">+{dayEvents.length - 2} more</div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Events Summary */}
      {events.length > 0 && (
        <div className="mt-6 pt-6 border-t">
          <h3 className="font-semibold text-gray-800 mb-3">Upcoming Events (Next 2 Months)</h3>
          <div className="space-y-2">
            {events.slice(0, 5).map((event) => (
              <div key={event.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                <div className="text-sm font-medium text-gray-700">
                  {format(new Date(event.start_date), 'MMM d')}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{event.title}</div>
                  {event.location && (
                    <div className="text-sm text-gray-600">{event.location}</div>
                  )}
                </div>
              </div>
            ))}
            {events.length > 5 && (
              <div className="text-sm text-gray-600 text-center pt-2">
                And {events.length - 5} more events...
              </div>
            )}
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedDate && selectedEvents.length > 0 && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-red-600">
                  Events for {format(selectedDate, 'MMMM d, yyyy')}
                </h2>
                <p className="text-gray-600 mt-1">
                  {format(selectedDate, 'EEEE')} • {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 text-2xl font-bold leading-none"
                aria-label="Close modal"
              >
                ×
              </button>
            </div>

            {/* Event List */}
            <div className="p-6 space-y-4">
              {selectedEvents.map((event) => (
                <div
                  key={event.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                    {event.category && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium">
                        {event.category}
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-700">
                    {/* Time */}
                    <div className="flex items-center gap-2">
                      <span className="font-medium">🕐</span>
                      <span>
                        {event.start_date
                          ? format(new Date(event.start_date), 'h:mm a')
                          : 'TBA'}
                      </span>
                      {event.day_of_week && (
                        <span className="text-gray-500">({event.day_of_week})</span>
                      )}
                    </div>

                    {/* Location */}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <span className="font-medium">📍</span>
                        <span>{event.location}</span>
                      </div>
                    )}

                    {/* Description */}
                    {event.description && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-end">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

