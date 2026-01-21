import { createServerClient } from '../supabase'
import type { CarouselImage } from '@/components/social/ImageCarousel'
import type { InstagramPost } from '@/components/social/InstagramFeed'

/**
 * Social Media Service
 * Handles fetching social media content from Supabase
 */

export const socialService = {
  /**
   * Get featured images for carousel
   * Fetches from media_gallery table, filtered by featured tag or recent posts
   */
  async getCarouselImages(limit = 5): Promise<CarouselImage[]> {
    try {
      const supabase = createServerClient()
      const { data, error } = await supabase
        .from('media_gallery')
        .select('*')
        .eq('type', 'image')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching carousel images:', error)
        return []
      }

      return (
        data?.map((item) => ({
          id: item.id,
          url: item.url,
          alt: item.title || item.description || 'Gallery image',
          title: item.title || undefined,
          description: item.description || undefined,
        })) || []
      )
    } catch (error) {
      console.error('Error in getCarouselImages:', error)
      return []
    }
  },

  /**
   * Get Instagram posts from Supabase
   * If you're storing Instagram posts in Supabase, use this method
   */
  async getInstagramPostsFromSupabase(limit = 12): Promise<InstagramPost[]> {
    try {
      const supabase = createServerClient()
      const { data, error } = await supabase
        .from('media_gallery')
        .select('*')
        .eq('type', 'image')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) {
        console.error('Error fetching Instagram posts:', error)
        return []
      }

      return (
        data?.map((item) => ({
          id: item.id,
          media_url: item.url,
          media_type: 'IMAGE' as const,
          permalink: `https://www.instagram.com/p/${item.id}/`,
          caption: item.description || undefined,
          timestamp: item.created_at,
          thumbnail_url: item.thumbnail_url || undefined,
        })) || []
      )
    } catch (error) {
      console.error('Error in getInstagramPostsFromSupabase:', error)
      return []
    }
  },
}
