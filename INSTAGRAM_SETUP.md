# Instagram Integration Setup Guide

## Overview

The social media page includes a beautiful Instagram feed component that can display posts from your Instagram account. This guide explains how to set up Instagram integration.

## Current Implementation

The social media page (`/social`) includes:
- **Image Carousel**: Displays featured highlights with auto-play
- **Instagram Feed**: Grid display of Instagram posts
- **Social Links**: Quick links to Instagram, Facebook, and YouTube

## Instagram Integration Options

### Option 1: Manual Posts (Easiest - Recommended for Quick Start)

Store Instagram posts in your Supabase `media_gallery` table:

1. **Add posts to Supabase**:
   ```sql
   INSERT INTO media_gallery (type, url, thumbnail_url, title, description, created_at)
   VALUES 
     ('image', 'https://instagram.com/p/.../media', 'thumbnail_url', 'Post Title', 'Caption', NOW()),
     ('image', 'https://instagram.com/p/.../media', 'thumbnail_url', 'Post Title', 'Caption', NOW());
   ```

2. **Update the API route** (`src/app/api/instagram/posts/route.ts`):
   Uncomment the Supabase code section and update it to fetch from your media_gallery table.

### Option 2: Instagram Basic Display API

**Requirements:**
- Instagram Business or Creator account
- Facebook Developer account
- Instagram App created

**Setup Steps:**

1. **Create Instagram App**:
   - Go to https://developers.facebook.com/
   - Create a new app
   - Add "Instagram Basic Display" product
   - Configure OAuth redirect URIs

2. **Get Access Token**:
   - Use OAuth flow to get user access token
   - Token expires after 60 days (use long-lived token)

3. **Add Environment Variables**:
   ```env
   INSTAGRAM_ACCESS_TOKEN=your_long_lived_access_token
   INSTAGRAM_USER_ID=your_instagram_user_id
   ```

4. **Update API Route**:
   Uncomment the Instagram Basic Display API code in `src/app/api/instagram/posts/route.ts`

### Option 3: Instagram Graph API (For Business Accounts)

**Requirements:**
- Instagram Business account
- Facebook Page connected to Instagram
- Facebook App with Instagram Graph API access

**Setup Steps:**

1. **Create Facebook App**:
   - Go to https://developers.facebook.com/
   - Create app and add "Instagram Graph API" product

2. **Get Page Access Token**:
   - Connect your Instagram Business account to Facebook Page
   - Get Page Access Token with `instagram_basic` permission

3. **Add Environment Variables**:
   ```env
   INSTAGRAM_ACCESS_TOKEN=your_page_access_token
   INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_account_id
   ```

4. **Update API Route**:
   Use Instagram Graph API endpoint:
   ```typescript
   const response = await fetch(
     `https://graph.facebook.com/v18.0/${INSTAGRAM_BUSINESS_ACCOUNT_ID}/media?fields=id,caption,media_type,media_url,permalink,thumbnail_url,timestamp&access_token=${accessToken}`
   )
   ```

## Current Status

The Instagram feed component is ready but currently shows:
- **Empty state** with "Visit Instagram" button (if no posts available)
- **Error state** with fallback link (if API fails)
- **Loading state** with skeleton placeholders

## Customization

### Update Instagram URL

Edit `src/app/social/page.tsx`:
```typescript
<InstagramFeed
  instagramUrl="https://www.instagram.com/your_username"
  maxPosts={12}
  showFollowButton={true}
/>
```

### Update Carousel Images

Replace the example images in `src/app/social/page.tsx` with your actual images from Supabase Storage:

```typescript
const carouselImages: CarouselImage[] = [
  {
    id: '1',
    url: 'https://your-project.supabase.co/storage/v1/object/public/media/featured-1.jpg',
    alt: 'Description',
    title: 'Title',
    description: 'Description',
  },
  // ... more images
]
```

### Fetch Images from Supabase

You can also fetch carousel images dynamically:

```typescript
// In the page component
const [carouselImages, setCarouselImages] = useState<CarouselImage[]>([])

useEffect(() => {
  async function fetchImages() {
    const supabase = createBrowserClient()
    const { data } = await supabase
      .from('media_gallery')
      .select('*')
      .eq('type', 'image')
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (data) {
      setCarouselImages(data.map(item => ({
        id: item.id,
        url: item.url,
        alt: item.title || '',
        title: item.title || '',
        description: item.description || '',
      })))
    }
  }
  fetchImages()
}, [])
```

## Features

### Image Carousel
- ✅ Auto-play with configurable interval
- ✅ Manual navigation (arrows and indicators)
- ✅ Pause on hover
- ✅ Smooth transitions
- ✅ Responsive design
- ✅ Image overlay with title/description
- ✅ Progress bar indicator

### Instagram Feed
- ✅ Responsive grid layout (2-4 columns)
- ✅ Hover effects with post details
- ✅ Media type indicators (video/carousel)
- ✅ Relative time display
- ✅ Direct links to Instagram posts
- ✅ Follow button with gradient styling
- ✅ Loading and error states
- ✅ Empty state fallback

## Testing

1. **Test Carousel**:
   - Visit `/social` page
   - Verify auto-play works
   - Test navigation arrows
   - Test indicator clicks
   - Verify hover pause

2. **Test Instagram Feed**:
   - With no API: Should show "Visit Instagram" link
   - With API configured: Should display posts
   - Test responsive layout
   - Verify links open in new tab

## Next Steps

1. **Choose integration method** (recommend Option 1 for quick start)
2. **Update carousel images** with your actual content
3. **Configure Instagram API** (if using Option 2 or 3)
4. **Customize styling** to match your brand
5. **Add more social platforms** (TikTok, Twitter, etc.)

## Troubleshooting

### Posts Not Showing
- Check API route logs in Vercel
- Verify access token is valid
- Check Instagram API rate limits
- Verify environment variables are set

### Images Not Loading
- Verify image URLs are accessible
- Check Supabase Storage bucket policies
- Verify CORS settings
- Check Next.js Image configuration

### Carousel Not Working
- Check browser console for errors
- Verify images array is not empty
- Check image URLs are valid
- Verify Next.js Image component configuration
