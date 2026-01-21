-- Add display_order and active fields to media_items table
ALTER TABLE media_items 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create index for display_order
CREATE INDEX IF NOT EXISTS idx_media_items_display_order ON media_items(display_order);
CREATE INDEX IF NOT EXISTS idx_media_items_active ON media_items(active);

-- Add trigger for updated_at
DROP TRIGGER IF EXISTS update_media_items_updated_at ON media_items;
CREATE TRIGGER update_media_items_updated_at
  BEFORE UPDATE ON media_items
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Update RLS policies
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admin full access to media_items" ON media_items;
DROP POLICY IF EXISTS "Public read access for media_items" ON media_items;

-- Create admin full access policy
CREATE POLICY "Admin full access to media_items"
  ON media_items FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Create public read access policy (only active images)
CREATE POLICY "Public read access for media_items"
  ON media_items FOR SELECT
  USING (active = true);
