import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { checkAuth } from '@/lib/auth/serverAuth'

export const dynamic = 'force-dynamic'

/**
 * Get about content (admin only)
 * GET /api/admin/about
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await checkAuth(request)
    if (!authResult.isAuthenticated || !authResult.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
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

/**
 * Create or update about content (admin only)
 * PUT /api/admin/about
 */
export async function PUT(request: NextRequest) {
  try {
    const authResult = await checkAuth(request)
    if (!authResult.isAuthenticated || !authResult.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { mission, vision, active } = body

    const supabase = createServerClient()

    // Check if content exists
    const { data: existing } = await supabase
      .from('about_content')
      .select('id')
      .limit(1)
      .maybeSingle()

    let result
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('about_content')
        .update({
          mission: mission || null,
          vision: vision || null,
          active: active !== undefined ? active : true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Create new
      const { data, error } = await supabase
        .from('about_content')
        .insert({
          mission: mission || null,
          vision: vision || null,
          active: active !== undefined ? active : true,
        })
        .select()
        .single()

      if (error) throw error
      result = data
    }

    return NextResponse.json({ 
      success: true,
      content: result 
    })
  } catch (error) {
    console.error('Error updating about content:', error)
    return NextResponse.json(
      { error: 'Failed to update about content' },
      { status: 500 }
    )
  }
}
