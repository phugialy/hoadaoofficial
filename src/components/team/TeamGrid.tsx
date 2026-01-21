'use client'

import { useState, useEffect } from 'react'
import TeamMemberCard from './TeamMemberCard'
import type { TeamMember } from '@/types'

export default function TeamGrid() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterRole, setFilterRole] = useState<string>('all')

  useEffect(() => {
    fetchTeamMembers()
  }, [])

  const fetchTeamMembers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/team')
      if (!response.ok) {
        // If API doesn't exist yet, use placeholder data
        setTeamMembers(getPlaceholderTeamMembers())
        setLoading(false)
        return
      }
      const data = await response.json()
      setTeamMembers(data.members || data || [])
      setError(null)
    } catch (err) {
      // Use placeholder data if API fails
      setTeamMembers(getPlaceholderTeamMembers())
      setError(null)
    } finally {
      setLoading(false)
    }
  }

  // Placeholder team members until API/database is set up
  const getPlaceholderTeamMembers = (): TeamMember[] => {
    return [
      {
        id: '1',
        name: 'Team Member Name',
        role: 'Lion Dance Performer',
        bio: 'Dedicated performer with years of experience in traditional Vietnamese Lion Dance. Passionate about preserving cultural heritage.',
        image_url: null,
        social_links: null,
        display_order: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Team Member Name',
        role: 'Drummer',
        bio: 'Skilled musician providing the rhythmic heartbeat of our performances. Expert in traditional percussion instruments.',
        image_url: null,
        social_links: null,
        display_order: 2,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Team Member Name',
        role: 'Lion Dance Performer',
        bio: 'Talented performer bringing energy and precision to every show. Committed to excellence in cultural expression.',
        image_url: null,
        social_links: null,
        display_order: 3,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Team Member Name',
        role: 'Cymbal Player',
        bio: 'Master of traditional cymbals, creating the vibrant sounds that accompany our lion dance performances.',
        image_url: null,
        social_links: null,
        display_order: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '5',
        name: 'Team Member Name',
        role: 'Team Leader',
        bio: 'Experienced leader guiding our team with dedication and passion. Committed to preserving and sharing Vietnamese cultural traditions.',
        image_url: null,
        social_links: null,
        display_order: 5,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '6',
        name: 'Team Member Name',
        role: 'Lion Dance Performer',
        bio: 'Energetic performer with a deep love for lion dance culture. Always striving to perfect every movement and gesture.',
        image_url: null,
        social_links: null,
        display_order: 6,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
  }

  // Get unique roles for filtering
  const uniqueRoles = Array.from(new Set(teamMembers.map(member => member.role)))
  const filteredMembers = filterRole === 'all' 
    ? teamMembers 
    : teamMembers.filter(member => member.role === filterRole)

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        <p className="mt-4 text-gray-600">Loading team members...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg border border-red-200">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchTeamMembers}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Role Filter */}
      {uniqueRoles.length > 1 && (
        <div className="mb-12 flex flex-wrap justify-center gap-3 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <button
            onClick={() => setFilterRole('all')}
            className={`px-6 py-2 rounded-xl font-medium text-body-sm transition-editorial ${
              filterRole === 'all'
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            All Members
          </button>
          {uniqueRoles.map((role) => (
            <button
              key={role}
              onClick={() => setFilterRole(role)}
              className={`px-6 py-2 rounded-xl font-medium text-body-sm transition-editorial ${
                filterRole === role
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      )}

      {/* Team Grid */}
      <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
        {filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {filteredMembers
              .sort((a, b) => a.display_order - b.display_order)
              .map((member) => (
                <TeamMemberCard key={member.id} member={member} />
              ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="text-body-lg text-gray-600 mb-2">No team members found</p>
            <p className="text-body-sm text-gray-500">Check back soon for updates</p>
          </div>
        )}
      </div>
    </div>
  )
}
