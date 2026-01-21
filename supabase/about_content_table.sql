-- About Content table for organization mission and vision
CREATE TABLE IF NOT EXISTS about_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mission TEXT,
  vision TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for active content
CREATE INDEX IF NOT EXISTS idx_about_content_active ON about_content(active);

-- Trigger for updated_at
CREATE TRIGGER update_about_content_updated_at
  BEFORE UPDATE ON about_content
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;

-- Public read access for active content
CREATE POLICY "Public read access for about_content"
  ON about_content FOR SELECT
  USING (active = true);

-- Admin full access (will be added via RLS admin policies)
-- Admin can insert, update, delete
