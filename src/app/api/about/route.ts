import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * Public API endpoint to fetch active about content
 * GET /api/about
 */
export async function GET() {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('about_content')
      .select('id, mission, vision')
      .eq('active', true)
      .order('updated_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('Error fetching about content:', error)
      return NextResponse.json(
        { error: 'Failed to fetch about content' },
        { status: 500 }
      )
    }

    return NextResponse.json({ content: data || null })
  } catch (error) {
    console.error('Error fetching about content:', error)
    return NextResponse.json(
      { error: 'Failed to fetch about content' },
      { status: 500 }
    )
  }
}
