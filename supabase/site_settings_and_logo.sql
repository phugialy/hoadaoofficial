-- Site settings (logo, future: site name, favicon, etc.)
-- Key-value: key='logo' => value = { "url": "...", "storagePath": "site/logo.png" }

CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS: public read (for nav), admin write
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read site_settings" ON site_settings;
CREATE POLICY "Public read site_settings"
  ON site_settings FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Admin write site_settings" ON site_settings;
CREATE POLICY "Admin write site_settings"
  ON site_settings FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
    OR (SELECT auth.users.raw_user_meta_data->>'role' FROM auth.users WHERE auth.users.id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
    OR (SELECT auth.users.raw_user_meta_data->>'role' FROM auth.users WHERE auth.users.id = auth.uid()) = 'admin'
  );

-- Ensure update_updated_at exists (from schema.sql)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ---------------------------------------------------------------------------
-- Storage: site bucket (for logo and other branding assets)
-- 1) Create bucket in Supabase Dashboard:
--    - Name: site
--    - Public: true
--    - File size limit: 2 MB
--    - Allowed MIME: image/png, image/jpeg, image/svg+xml, image/webp
-- 2) Then run the policies below.
-- ---------------------------------------------------------------------------

-- Policies for storage.objects, bucket_id = 'site'
DROP POLICY IF EXISTS "Public read site bucket" ON storage.objects;
CREATE POLICY "Public read site bucket"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'site');

DROP POLICY IF EXISTS "Admin upload site bucket" ON storage.objects;
CREATE POLICY "Admin upload site bucket"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'site'
    AND auth.role() = 'authenticated'
    AND (
      (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
      OR EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

DROP POLICY IF EXISTS "Admin update site bucket" ON storage.objects;
CREATE POLICY "Admin update site bucket"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'site'
    AND auth.role() = 'authenticated'
    AND (
      (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
      OR EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );

DROP POLICY IF EXISTS "Admin delete site bucket" ON storage.objects;
CREATE POLICY "Admin delete site bucket"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'site'
    AND auth.role() = 'authenticated'
    AND (
      (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
      OR EXISTS (SELECT 1 FROM auth.users WHERE auth.users.id = auth.uid() AND auth.users.raw_user_meta_data->>'role' = 'admin')
    )
  );
