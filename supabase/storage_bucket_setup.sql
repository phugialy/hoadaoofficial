-- Create storage bucket for gallery images
-- Note: Run this in Supabase SQL Editor or via Supabase CLI
-- Storage buckets cannot be created via SQL directly, but you can configure them via Supabase Dashboard
-- This file documents the bucket configuration needed

-- Bucket name: gallery
-- Public: true (for public read access)
-- File size limit: 10MB (configure in Supabase Dashboard)
-- Allowed MIME types: image/* (configure in Supabase Dashboard)

-- After creating the bucket in Supabase Dashboard, you'll need to set up policies:

-- Policy 1: Allow authenticated users (admins) to upload files
-- INSERT policy for authenticated users with admin role
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

-- Policy 2: Allow authenticated users (admins) to update/delete their own uploads
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
