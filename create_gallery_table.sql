-- ============================================
-- CREATE GALLERY_IMAGES TABLE
-- Run this in Supabase SQL Editor
-- ============================================

-- Create the gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    caption TEXT,
    image_url TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    size TEXT DEFAULT 'small' CHECK (size IN ('small', 'large', 'wide')),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- Allow public to view active images
CREATE POLICY "Allow public to view active gallery images" ON gallery_images
    FOR SELECT USING (is_active = true);

-- Allow admins full access
CREATE POLICY "Allow admins to manage gallery images" ON gallery_images
    FOR ALL USING (
        auth.role() = 'authenticated' 
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_gallery_images_updated_at ON gallery_images;
CREATE TRIGGER update_gallery_images_updated_at
    BEFORE UPDATE ON gallery_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

SELECT 'gallery_images table created successfully!' AS result;
