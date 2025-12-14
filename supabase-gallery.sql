-- ============================================
-- Gallery Images Table
-- Run this in Supabase SQL Editor
-- ============================================

-- Create gallery_images table
CREATE TABLE IF NOT EXISTS public.gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    caption TEXT,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    size TEXT DEFAULT 'small' CHECK (size IN ('small', 'large', 'wide')),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view active gallery images
CREATE POLICY "gallery_select" ON gallery_images
  FOR SELECT USING (
    is_active = true 
    OR EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = (select auth.uid()) 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Only admins can insert
CREATE POLICY "gallery_insert" ON gallery_images
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = (select auth.uid()) 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Only admins can update
CREATE POLICY "gallery_update" ON gallery_images
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = (select auth.uid()) 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Only admins can delete
CREATE POLICY "gallery_delete" ON gallery_images
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = (select auth.uid()) 
      AND role IN ('admin', 'super_admin')
    )
  );

-- Create updated_at trigger
CREATE TRIGGER gallery_images_updated_at
    BEFORE UPDATE ON gallery_images
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Insert sample data
INSERT INTO gallery_images (title, caption, image_url, category, size, display_order) VALUES
('Free Malaria Testing Drive', 'Community outreach program', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=2070', 'Outreach', 'large', 1),
('Pediatric Consultation', 'Caring for young patients', 'https://images.unsplash.com/photo-1584515933487-9d900da67353?auto=format&fit=crop&q=80&w=1000', 'Services', 'small', 2),
('Community Health Talk', 'Health education session', 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=1000', 'Outreach', 'small', 3),
('Blood Pressure Checks', 'Free BP monitoring', 'https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&q=80&w=1000', 'Services', 'wide', 4);

-- Verify
SELECT * FROM gallery_images ORDER BY display_order;
