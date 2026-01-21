-- Admin RLS Policies for Events Table
-- These policies allow authenticated admin users to see all events (including private ones)

-- Drop existing admin policy if it exists (to allow re-running this migration)
DROP POLICY IF EXISTS "Admin read access for events" ON events;
DROP POLICY IF EXISTS "Admin write access for events" ON events;
DROP POLICY IF EXISTS "Admin update access for events" ON events;
DROP POLICY IF EXISTS "Admin delete access for events" ON events;

-- Admin read access: Admins can see ALL events (public and private)
CREATE POLICY "Admin read access for events"
  ON events FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
  );

-- Admin insert access: Admins can create events
CREATE POLICY "Admin write access for events"
  ON events FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
  );

-- Admin update access: Admins can update any event
CREATE POLICY "Admin update access for events"
  ON events FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
  );

-- Admin delete access: Admins can delete any event
CREATE POLICY "Admin delete access for events"
  ON events FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
  );

-- Admin RLS Policies for Carousel Images Table
DROP POLICY IF EXISTS "Admin full access to carousel_images" ON carousel_images;

CREATE POLICY "Admin full access to carousel_images"
  ON carousel_images
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
  );

-- Admin RLS Policies for Instagram Posts Table
DROP POLICY IF EXISTS "Admin full access to instagram_posts" ON instagram_posts;

CREATE POLICY "Admin full access to instagram_posts"
  ON instagram_posts
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
  );

