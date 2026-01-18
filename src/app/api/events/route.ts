import { NextRequest, NextResponse } from 'next/server'
import { eventsService } from '@/lib/services/eventsService'
import { createServerClient } from '@/lib/supabase'

// Force dynamic rendering for this API route (uses searchParams)
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const monthsParam = searchParams.get('months')

    // If months parameter is provided, filter to next N months
    if (monthsParam) {
      const months = parseInt(monthsParam, 10)
      if (isNaN(months) || months < 1) {
        return NextResponse.json({ error: 'Invalid months parameter' }, { status: 400 })
      }

      const now = new Date()
      const endDate = new Date()
      endDate.setMonth(now.getMonth() + months)

      const supabase = createServerClient()
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('public', true)
        .gte('start_date', now.toISOString())
        .lte('start_date', endDate.toISOString())
        .order('start_date', { ascending: true })

      if (error) throw error
      return NextResponse.json(data)
    }

    // Default: get all public events
    const events = await eventsService.getAll()
    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}


