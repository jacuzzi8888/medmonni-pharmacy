-- ============================================
-- Phase 3A: Visual Content Tables
-- Carousel and Category management
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- CAROUSEL SLIDES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS carousel_slides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  button_text TEXT,
  button_link TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES user_profiles(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_carousel_slides_order ON carousel_slides(display_order);
CREATE INDEX IF NOT EXISTS idx_carousel_slides_active ON carousel_slides(is_active);

-- ============================================
-- CATEGORIES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES user_profiles(id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(display_order);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- Using simple policies that work with disabled user_profiles RLS
-- ============================================

-- Disable RLS for now (simpler, since user_profiles RLS is disabled)
-- We can enable proper RLS later when user_profiles RLS is fixed

ALTER TABLE carousel_slides DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;

-- Grant access to authenticated users
GRANT ALL ON carousel_slides TO authenticated;
GRANT ALL ON carousel_slides TO anon;
GRANT ALL ON categories TO authenticated;
GRANT ALL ON categories TO anon;

-- ============================================
-- TRIGGER FOR updated_at
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to carousel_slides (drop first if exists)
DROP TRIGGER IF EXISTS update_carousel_slides_updated_at ON carousel_slides;
CREATE TRIGGER update_carousel_slides_updated_at
    BEFORE UPDATE ON carousel_slides
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to categories (drop first if exists)
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
    BEFORE UPDATE ON categories
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- STORAGE BUCKET FOR IMAGES
-- ============================================

-- Note: Run these in the Supabase Dashboard > Storage
-- 1. Create a bucket called "carousel-images"
-- 2. Create a bucket called "category-images"
-- 3. Set both to public

-- ============================================
-- VERIFICATION
-- ============================================

-- Check tables were created
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('carousel_slides', 'categories');
