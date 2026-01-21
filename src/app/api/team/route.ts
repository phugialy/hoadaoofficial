import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * Get all team members
 * GET /api/team
 */
export async function GET() {
  try {
    const supabase = createServerClient()
    
    // Check if team_members table exists, if not return empty array
    const { data, error } = await supabase
      .from('team_members')
      .select('*')
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      // If table doesn't exist, return empty array (graceful degradation)
      if (error.code === '42P01') {
        return NextResponse.json({ members: [] })
      }
      throw error
    }

    return NextResponse.json({ members: data || [] })
  } catch (error) {
    console.error('Error fetching team members:', error)
    // Return empty array on error so page still renders
    return NextResponse.json({ members: [] })
  }
}
