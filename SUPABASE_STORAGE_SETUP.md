# Supabase Storage Setup Guide

This guide will help you set up Supabase Storage for the gallery feature.

## Step 1: Run Database Migrations

First, update the `media_items` table to add `display_order` and `active` fields:

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the SQL from `supabase/gallery_storage_setup.sql`:

```sql
-- Add display_order and active fields to media_items table
ALTER TABLE media_items 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_media_items_display_order ON media_items(display_order);
CREATE INDEX IF NOT EXISTS idx_media_items_active ON media_items(active);

-- Add trigger for updated_at
CREATE TRIGGER update_media_items_updated_at
  BEFORE UPDATE ON media_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update RLS policies
CREATE POLICY IF NOT EXISTS "Admin full access to media_items"
  ON media_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

DROP POLICY IF EXISTS "Public read access for media_items";
CREATE POLICY "Public read access for media_items"
  ON media_items FOR SELECT
  USING (active = true);
```

## Step 2: Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New bucket**
4. Configure the bucket:
   - **Name**: `gallery`
   - **Public bucket**: ✅ Check this (enables public read access)
   - **File size limit**: 10 MB (or your preferred limit)
   - **Allowed MIME types**: `image/*` (for images only)

5. Click **Create bucket**

## Step 3: Set Up Storage Policies

After creating the bucket, set up Row Level Security policies:

1. In Supabase dashboard, go to **Storage** → **Policies**
2. Select the `gallery` bucket
3. Run the SQL from `supabase/storage_bucket_setup.sql` in the SQL Editor:

```sql
-- Policy 1: Allow authenticated admins to upload files
CREATE POLICY IF NOT EXISTS "Admin can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'gallery' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policy 2: Allow authenticated admins to update/delete
CREATE POLICY IF NOT EXISTS "Admin can update images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'gallery' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE POLICY IF NOT EXISTS "Admin can delete images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'gallery' AND
    auth.role() = 'authenticated' AND
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Policy 3: Allow public read access
CREATE POLICY IF NOT EXISTS "Public can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'gallery');
```

## Step 4: Test the Setup

1. Log in to the admin panel at `/admin/login`
2. Navigate to **Admin** → **Gallery**
3. Try uploading an image
4. Verify the image appears in the gallery
5. Check that images are accessible publicly at `/gallery`

## Features

### Admin Gallery (`/admin/gallery`)
- ✅ Upload images directly to Supabase Storage
- ✅ Manage image metadata (title, description, display order)
- ✅ Toggle active/inactive status
- ✅ Delete images (removes from both storage and database)
- ✅ Pagination support (50 images per page)

### Public Gallery (`/gallery`)
- ✅ Display all active gallery images
- ✅ Configurable pagination (12, 20, 40, or 60 per page)
- ✅ Lightbox modal for full-size image viewing
- ✅ Responsive grid layout
- ✅ Hover effects and animations

### Carousel Integration (`/admin/carousel`)
- ✅ Select images from gallery OR upload via URL
- ✅ Option to add carousel images to gallery automatically
- ✅ Images uploaded via URL can be added to gallery with checkbox

## Storage Structure

Images are stored in Supabase Storage with the following path structure:
```
gallery/
  ├── {timestamp}-{random}.jpg
  ├── {timestamp}-{random}.png
  └── ...
```

## File Size Limits

- Default maximum file size: **10 MB**
- Supported formats: All image types (JPG, PNG, WebP, GIF, etc.)
- You can adjust the limit in Supabase Dashboard → Storage → Settings

## Troubleshooting

### "Storage bucket 'gallery' not found"
- Make sure you created the bucket in Step 2
- Verify the bucket name is exactly `gallery` (case-sensitive)

### "Permission denied" when uploading
- Check that you're logged in as an admin user
- Verify the storage policies were created correctly in Step 3
- Ensure your user has `role: 'admin'` in user metadata

### Images not showing publicly
- Verify the bucket is set to **Public** in Supabase Dashboard
- Check that the `Public can view images` policy exists
- Ensure images have `active = true` in the database

### Upload fails with "File size too large"
- Check the file size limit in Supabase Storage settings
- Reduce image size before uploading
- Consider compressing images client-side before upload

## Next Steps

After setup:
1. Upload your first images via `/admin/gallery`
2. Add images to the carousel via `/admin/carousel`
3. View the public gallery at `/gallery`
4. Configure pagination preferences for public gallery
