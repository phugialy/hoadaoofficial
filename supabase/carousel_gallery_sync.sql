-- Add gallery_item_id column to carousel_images to track which gallery item it references
ALTER TABLE carousel_images 
ADD COLUMN IF NOT EXISTS gallery_item_id UUID REFERENCES media_items(id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_carousel_images_gallery_item_id ON carousel_images(gallery_item_id);

-- Function to sync carousel images from gallery when gallery item is updated
CREATE OR REPLACE FUNCTION sync_carousel_from_gallery()
RETURNS TRIGGER AS $$
BEGIN
  -- Update all carousel images that reference this gallery item
  UPDATE carousel_images
  SET 
    url = NEW.url,
    title = NEW.title,
    description = NEW.description,
    updated_at = NOW()
  WHERE gallery_item_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically sync carousel when gallery item is updated
DROP TRIGGER IF EXISTS trigger_sync_carousel_from_gallery ON media_items;
CREATE TRIGGER trigger_sync_carousel_from_gallery
  AFTER UPDATE ON media_items
  FOR EACH ROW
  WHEN (OLD.url IS DISTINCT FROM NEW.url OR 
        OLD.title IS DISTINCT FROM NEW.title OR 
        OLD.description IS DISTINCT FROM NEW.description)
  EXECUTE FUNCTION sync_carousel_from_gallery();
