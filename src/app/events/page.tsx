'use client'

import { useState } from 'react'
import { MainLayout } from '@/components/layout/MainLayout'
import EventCalendarView from '@/components/events/EventCalendarView'
import EventTableView from '@/components/events/EventTableView'

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'calendar' | 'table'>('calendar')

  return (
    <MainLayout>
      <div className="luxury-padding bg-gradient-to-b from-white via-gray-50/50 to-white">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-16 md:mb-20 animate-fade-in">
            <h1 className="heading-editorial text-red-600 mb-6 font-display">
              Events
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-red-500 to-gold-500 mx-auto rounded-full mb-8"></div>
            <p className="text-editorial text-gray-600 max-w-2xl mx-auto">
              Discover our upcoming performances and cultural celebrations
            </p>
          </div>

          {/* View Toggle */}
          <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-center gap-2 bg-white rounded-xl shadow-sm p-2 border border-gray-200 max-w-md mx-auto">
              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-body-sm transition-editorial flex items-center justify-center gap-2 ${
                  activeTab === 'calendar'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Calendar
              </button>
              <button
                onClick={() => setActiveTab('table')}
                className={`flex-1 py-3 px-6 rounded-lg font-medium text-body-sm transition-editorial flex items-center justify-center gap-2 ${
                  activeTab === 'table'
                    ? 'bg-red-600 text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                List
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {activeTab === 'calendar' ? <EventCalendarView /> : <EventTableView />}
          </div>
        </div>
      </div>
    </MainLayout>
  )
}

