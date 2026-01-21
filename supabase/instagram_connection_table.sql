-- Instagram Connection Settings table
-- Stores Instagram API credentials and connection status
CREATE TABLE IF NOT EXISTS instagram_connection (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instagram_business_account_id VARCHAR(255) UNIQUE,
  access_token TEXT NOT NULL,
  token_expires_at TIMESTAMPTZ,
  username VARCHAR(255),
  last_synced_at TIMESTAMPTZ,
  sync_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for quick lookup
CREATE INDEX IF NOT EXISTS idx_instagram_connection_active ON instagram_connection(sync_enabled);

-- Trigger for updated_at
CREATE TRIGGER update_instagram_connection_updated_at
  BEFORE UPDATE ON instagram_connection
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS Policies
ALTER TABLE instagram_connection ENABLE ROW LEVEL SECURITY;

-- Only admins can access connection settings
CREATE POLICY "Admin full access to instagram_connection"
  ON instagram_connection
  FOR ALL
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'is_admin' = 'true'
  );
