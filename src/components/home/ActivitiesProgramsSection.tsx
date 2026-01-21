import { createServerClient } from '@/lib/supabase'
import Link from 'next/link'
import { format } from 'date-fns'

interface Event {
  id: string
  title: string
  description: string | null
  start_date: string
  location: string | null
  category: 'daily' | 'weekly' | 'special'
}

export default async function ActivitiesProgramsSection() {
  let upcomingEvents: Event[] = []

  try {
    const supabase = createServerClient()
    const now = new Date()
    const { data, error } = await supabase
      .from('events')
      .select('id, title, description, start_date, location, category')
      .eq('public', true)
      .gte('start_date', now.toISOString())
      .order('start_date', { ascending: true })
      .limit(6) // Show 6 upcoming events

    if (!error && data) {
      upcomingEvents = data
    }
  } catch (error) {
    console.error('Error fetching upcoming events:', error)
  }

  if (upcomingEvents.length === 0) {
    return null // Don't show section if no events
  }

  const formatDate = (dateStr: string) => {
    return format(new Date(dateStr), 'MMM d, yyyy')
  }

  const formatTime = (dateStr: string) => {
    return format(new Date(dateStr), 'h:mm a')
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'special':
        return 'bg-red-100 text-red-800'
      case 'weekly':
        return 'bg-blue-100 text-blue-800'
      case 'daily':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <section className="luxury-padding bg-gradient-to-b from-white via-red-50/20 to-white">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="text-center mb-16 md:mb-20 animate-fade-in">
          <h2 className="heading-editorial text-gray-900 mb-6 font-display">
            Activities & Programs
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-gold-500 mx-auto rounded-full mb-8"></div>
          <p className="text-editorial text-gray-600 max-w-2xl mx-auto">
            Highlight key cultural programs and initiatives or upcoming events
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {upcomingEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-md p-8 hover-lift hover-glow transition-editorial"
            >
              {/* Category Badge */}
              <div className="flex items-center justify-between mb-6">
                <span className={`px-4 py-1.5 text-xs font-semibold rounded-full ${getCategoryColor(event.category)}`}>
                  {event.category.charAt(0).toUpperCase() + event.category.slice(1)}
                </span>
              </div>

              {/* Event Title */}
              <h3 className="text-2xl font-display font-semibold text-gray-900 mb-6 line-clamp-2 tracking-tight">
                {event.title}
              </h3>

              {/* Date & Time */}
              <div className="flex items-center gap-3 text-gray-600 mb-4">
                <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-body-sm font-medium">
                  {formatDate(event.start_date)} at {formatTime(event.start_date)}
                </span>
              </div>

              {/* Location */}
              {event.location && (
                <div className="flex items-center gap-3 text-gray-600 mb-6">
                  <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="text-body-sm">{event.location}</span>
                </div>
              )}

              {/* Description */}
              {event.description && (
                <p className="text-body-sm text-gray-600 mb-0 line-clamp-3 leading-relaxed">
                  {event.description}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* View More Link */}
        <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
          <Link
            href="/events"
            className="inline-flex items-center gap-3 px-10 py-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-editorial hover-lift shadow-md hover:shadow-xl"
          >
            View All Events
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
