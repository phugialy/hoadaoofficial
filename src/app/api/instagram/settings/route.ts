import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

/**
 * Get Instagram and Facebook settings (public - for displaying social links in footer)
 * GET /api/instagram/settings
 */
export async function GET() {
  try {
    const supabase = createServerClient()
    
    const { data, error } = await supabase
      .from('instagram_settings')
      .select('instagram_url, facebook_url')
      .eq('id', '00000000-0000-0000-0000-000000000001')
      .single()

    if (error && error.code !== 'PGRST116') {
      // If no settings found, return defaults
      return NextResponse.json({ 
        instagram_url: 'https://www.instagram.com/hoadaoofficial',
        facebook_url: 'https://www.facebook.com/p/Hoa-Dao-Lion-Dance-Association-100063902301552/'
      })
    }

    return NextResponse.json({ 
      instagram_url: data?.instagram_url || 'https://www.instagram.com/hoadaoofficial',
      facebook_url: data?.facebook_url || 'https://www.facebook.com/p/Hoa-Dao-Lion-Dance-Association-100063902301552/'
    })
  } catch (error) {
    console.error('Error fetching Instagram settings:', error)
    return NextResponse.json(
      { 
        instagram_url: 'https://www.instagram.com/hoadaoofficial',
        facebook_url: 'https://www.facebook.com/p/Hoa-Dao-Lion-Dance-Association-100063902301552/'
      },
      { status: 500 }
    )
  }
}
