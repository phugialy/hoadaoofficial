import { createServerClient } from '../supabase'
import type { Event } from '@/types'

export const eventsService = {
  // Get all events
  async getAll(): Promise<Event[]> {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('public', true)
      .order('start_date', { ascending: true })
    
    if (error) throw error
    return data as Event[]
  },

  // Get single event
  async getById(id: string): Promise<Event | null> {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('id', id)
      .eq('public', true)
      .single()
    
    if (error) throw error
    return data as Event
  },

  // Get upcoming events
  async getUpcoming(limit = 5): Promise<Event[]> {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('public', true)
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })
      .limit(limit)
    
    if (error) throw error
    return data as Event[]
  },

  // Get events by category
  async getByCategory(category: Event['category']): Promise<Event[]> {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('public', true)
      .eq('category', category)
      .order('start_date', { ascending: true })
    
    if (error) throw error
    return data as Event[]
  },
}

