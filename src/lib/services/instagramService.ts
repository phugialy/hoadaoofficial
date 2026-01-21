/**
 * Instagram Service
 * Provides utilities for working with Instagram without API authentication
 */

/**
 * Extract Instagram post ID from URL
 */
export function extractInstagramPostId(url: string): string | null {
  const patterns = [
    /instagram\.com\/p\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/reel\/([A-Za-z0-9_-]+)/,
    /instagram\.com\/tv\/([A-Za-z0-9_-]+)/,
  ]

  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }

  return null
}

/**
 * Get Instagram post oEmbed data (no authentication required for public posts)
 */
export async function getInstagramPostOEmbed(postId: string) {
  try {
    const url = `https://api.instagram.com/oembed/?url=https://www.instagram.com/p/${postId}/`
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Instagram oEmbed API returned ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('Error fetching Instagram oEmbed:', error)
    throw error
  }
}

/**
 * Parse Instagram oEmbed data into our post format
 */
export function parseOEmbedToPost(oembedData: any, postId: string) {
  return {
    instagram_post_id: postId,
    media_url: oembedData.thumbnail_url || '',
    media_type: 'IMAGE' as const, // oEmbed doesn't distinguish, default to IMAGE
    permalink: `https://www.instagram.com/p/${postId}/`,
    caption: oembedData.title || null,
    timestamp: new Date().toISOString(),
    username: oembedData.author_name?.replace('@', '') || null,
    thumbnail_url: oembedData.thumbnail_url || null,
  }
}

/**
 * Sync posts using instagrapi service (if configured)
 * WARNING: This uses unofficial API - use at your own risk
 */
export async function syncViaInstagrapi(username: string) {
  const serviceUrl = process.env.INSTAGRAPI_SERVICE_URL

  if (!serviceUrl) {
    throw new Error('Instagrapi service URL not configured')
  }

  try {
    const response = await fetch(`${serviceUrl}/api/posts/${username}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      throw new Error(error.message || 'Failed to fetch from instagrapi service')
    }

    const data = await response.json()
    return data.posts || []
  } catch (error) {
    console.error('Instagrapi sync error:', error)
    throw error
  }
}
