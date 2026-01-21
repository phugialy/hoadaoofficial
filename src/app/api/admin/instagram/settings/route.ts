import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * Get Instagram and Facebook settings (admin)
 * GET /api/admin/instagram/settings
 */
export async function GET() {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('instagram_settings')
      .select('*')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    // If no settings exist, return defaults
    if (!data) {
      return NextResponse.json({ 
        instagram_url: 'https://www.instagram.com/hoadaoofficial',
        facebook_url: 'https://www.facebook.com/p/Hoa-Dao-Lion-Dance-Association-100063902301552/',
        id: null,
      })
    }

    return NextResponse.json({
      ...data,
      facebook_url: data.facebook_url || 'https://www.facebook.com/p/Hoa-Dao-Lion-Dance-Association-100063902301552/',
    })
  } catch (error) {
    console.error('Error fetching Instagram settings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Instagram settings' },
      { status: 500 }
    )
  }
}

/**
 * Update Instagram settings (admin only)
 * PUT /api/admin/instagram/settings
 */
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { instagram_url, facebook_url } = body

    if (!instagram_url && !facebook_url) {
      return NextResponse.json(
        { error: 'At least one URL is required' },
        { status: 400 }
      )
    }

    const updateData: { instagram_url?: string; facebook_url?: string } = {}

    if (instagram_url) {
      try {
        new URL(instagram_url)
        updateData.instagram_url = instagram_url
      } catch {
        return NextResponse.json(
          { error: 'Invalid Instagram URL format' },
          { status: 400 }
        )
      }
    }

    if (facebook_url) {
      try {
        new URL(facebook_url)
        updateData.facebook_url = facebook_url
      } catch {
        return NextResponse.json(
          { error: 'Invalid Facebook URL format' },
          { status: 400 }
        )
      }
    }

    const supabase = createServerClient()

    // Check if settings exist
    const { data: existing } = await supabase
      .from('instagram_settings')
      .select('id')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single()

    let result
    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from('instagram_settings')
        .update(updateData)
        .eq('id', '00000000-0000-0000-0000-000000000001')
        .select()
        .single()

      if (error) throw error
      result = data
    } else {
      // Create new
      const { data, error } = await supabase
        .from('instagram_settings')
        .insert({
          id: '00000000-0000-0000-0000-000000000001',
          instagram_url: updateData.instagram_url || 'https://www.instagram.com/hoadaoofficial',
          facebook_url: updateData.facebook_url || 'https://www.facebook.com/p/Hoa-Dao-Lion-Dance-Association-100063902301552/',
        })
        .select()
        .single()

      if (error) throw error
      result = data
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error updating Instagram settings:', error)
    return NextResponse.json(
      { error: 'Failed to update Instagram settings' },
      { status: 500 }
    )
  }
}
