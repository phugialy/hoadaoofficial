-- Carousel Images table for managing featured carousel images
CREATE TABLE IF NOT EXISTS carousel_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  url TEXT NOT NULL,
  alt TEXT,
  title VARCHAR(255),
  description TEXT,
  display_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Instagram Posts table for managing Instagram feed
CREATE TABLE IF NOT EXISTS instagram_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instagram_post_id VARCHAR(255) UNIQUE NOT NULL, -- Instagram's post ID
  media_url TEXT NOT NULL,
  media_type VARCHAR(20) CHECK (media_type IN ('IMAGE', 'VIDEO', 'CAROUSEL_ALBUM')) DEFAULT 'IMAGE',
  permalink TEXT NOT NULL,
  caption TEXT,
  timestamp TIMESTAMPTZ NOT NULL,
  username VARCHAR(255),
  thumbnail_url TEXT,
  active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_carousel_images_active ON carousel_images(active);
CREATE INDEX IF NOT EXISTS idx_carousel_images_display_order ON carousel_images(display_order);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_active ON instagram_posts(active);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_display_order ON instagram_posts(display_order);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_timestamp ON instagram_posts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_instagram_posts_instagram_id ON instagram_posts(instagram_post_id);

-- Triggers for updated_at
CREATE TRIGGER update_carousel_images_updated_at
  BEFORE UPDATE ON carousel_images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_instagram_posts_updated_at
  BEFORE UPDATE ON instagram_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE carousel_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE instagram_posts ENABLE ROW LEVEL SECURITY;

-- Public read access for active items
CREATE POLICY "Public read access for carousel_images"
  ON carousel_images FOR SELECT
  USING (active = true);

CREATE POLICY "Public read access for instagram_posts"
  ON instagram_posts FOR SELECT
  USING (active = true);

-- Admin full access (will be added via RLS admin policies)
-- These tables will be managed through admin panel
