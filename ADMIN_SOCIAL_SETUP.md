# Admin Social Media Management Setup

## Overview

The admin dashboard now includes management for:
- **Carousel Images**: Featured images displayed on the homepage carousel
- **Instagram Posts**: Posts displayed in the Instagram feed on homepage and social page

## Database Setup

### Step 1: Run the SQL Migration

Execute the SQL file to create the necessary tables:

```bash
# In Supabase Dashboard SQL Editor, run:
supabase/admin_social_tables.sql
```

Or manually run the SQL in your Supabase SQL Editor.

### Step 2: Set Up RLS Policies

Add admin access policies to `supabase/rls_admin_policies.sql`:

```sql
-- Admin full access to carousel_images
CREATE POLICY "Admin full access to carousel_images"
  ON carousel_images
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );

-- Admin full access to instagram_posts
CREATE POLICY "Admin full access to instagram_posts"
  ON instagram_posts
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'is_admin' = 'true'
    )
  );
```

## Admin Dashboard Structure

### Main Dashboard (`/admin`)
- Overview of all admin features
- Quick stats (coming soon)
- Navigation cards to different management sections

### Carousel Management (`/admin/carousel`)
- View all carousel images
- Add new images
- Edit existing images
- Toggle active/inactive status
- Delete images
- Set display order

### Instagram Management (`/admin/instagram`)
- View all Instagram posts
- Add new posts manually
- Edit existing posts
- Toggle active/inactive status
- Delete posts
- Set display order

### Calendar Management (`/admin/calendar`)
- Existing calendar/events management
- Now linked to dashboard

## Features

### Carousel Images
- **URL**: Direct image URL (can be from Supabase Storage or external)
- **Alt Text**: Accessibility text
- **Title**: Displayed on carousel overlay
- **Description**: Displayed on carousel overlay
- **Display Order**: Controls order of appearance
- **Active**: Toggle visibility on homepage

### Instagram Posts
- **Instagram Post ID**: Unique identifier from Instagram
- **Media URL**: Image/video URL
- **Media Type**: IMAGE, VIDEO, or CAROUSEL_ALBUM
- **Permalink**: Link to Instagram post
- **Caption**: Post caption text
- **Timestamp**: Post date/time
- **Username**: Instagram username
- **Thumbnail URL**: For videos/carousels
- **Display Order**: Controls order of appearance
- **Active**: Toggle visibility on homepage/social page

## Usage

### Adding Carousel Images

1. Go to `/admin/carousel`
2. Click "+ Add Image"
3. Fill in the form:
   - **Image URL**: Full URL to the image (e.g., `https://your-project.supabase.co/storage/v1/object/public/media/image.jpg`)
   - **Title**: Title shown on carousel
   - **Description**: Description shown on carousel
   - **Display Order**: Lower numbers appear first
   - **Active**: Check to make visible
4. Click "Create"

### Adding Instagram Posts

1. Go to `/admin/instagram`
2. Click "+ Add Post"
3. Fill in the form:
   - **Instagram Post ID**: Unique ID (can be any identifier)
   - **Media URL**: Full URL to the image/video
   - **Permalink**: Link to Instagram post
   - **Caption**: Post caption
   - **Timestamp**: When the post was made
   - **Display Order**: Lower numbers appear first
   - **Active**: Check to make visible
4. Click "Create"

### Managing Content

- **Edit**: Click "Edit" on any item to modify
- **Activate/Deactivate**: Toggle visibility without deleting
- **Delete**: Remove permanently (with confirmation)
- **Reorder**: Change display_order to change appearance order

## API Endpoints

### Public Endpoints (No Auth Required)

- `GET /api/carousel` - Get active carousel images
- `GET /api/instagram/posts` - Get active Instagram posts

### Admin Endpoints (Requires Admin Auth)

**Carousel:**
- `GET /api/admin/carousel` - Get all carousel images
- `POST /api/admin/carousel` - Create new image
- `PUT /api/admin/carousel/[id]` - Update image
- `DELETE /api/admin/carousel/[id]` - Delete image

**Instagram:**
- `GET /api/admin/instagram` - Get all Instagram posts
- `POST /api/admin/instagram` - Create new post
- `PUT /api/admin/instagram/[id]` - Update post
- `DELETE /api/admin/instagram/[id]` - Delete post

## Integration with Homepage

The homepage (`/`) and social page (`/social`) automatically fetch:
- Active carousel images from `/api/carousel`
- Active Instagram posts from `/api/instagram/posts`

If no items are found in the database, they fall back to default example content.

## Uploading Images to Supabase Storage

To use Supabase Storage for images:

1. Go to Supabase Dashboard → Storage
2. Upload images to your bucket (e.g., `media` bucket)
3. Copy the public URL
4. Use that URL in the admin forms

Example URL format:
```
https://[project-ref].supabase.co/storage/v1/object/public/[bucket]/[path]/[filename]
```

## Next Steps

1. ✅ Run database migration (`admin_social_tables.sql`)
2. ✅ Add RLS policies for admin access
3. ✅ Log in to admin dashboard (`/admin/login`)
4. ✅ Add carousel images
5. ✅ Add Instagram posts
6. ✅ Verify they appear on homepage

## Troubleshooting

### Images not showing on homepage
- Check that images are marked as "Active"
- Verify image URLs are accessible
- Check browser console for errors
- Verify API endpoints are working

### Can't access admin pages
- Ensure you're logged in as admin user
- Check user metadata has `is_admin: true`
- Verify RLS policies are set correctly

### Database errors
- Ensure tables are created (`carousel_images`, `instagram_posts`)
- Check RLS policies allow admin access
- Verify Supabase connection is working
