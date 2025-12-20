-- ============================================
-- MEDOMNI PHARMACY - COMPLETE DATABASE MIGRATION
-- Run this in the CLIENT'S Supabase SQL Editor
-- ============================================
-- 
-- This script creates ALL tables and RLS policies needed
-- for the Medomni Pharmacy application.
--
-- INSTRUCTIONS:
-- 1. Log into the client's Supabase Dashboard
-- 2. Go to SQL Editor
-- 3. Paste this entire script
-- 4. Click "Run"
-- 5. Update environment variables in the app
-- ============================================

-- ============================================
-- PART 1: HELPER FUNCTION (updated_at trigger)
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- PART 2: USER_PROFILES TABLE (Admin system)
-- ============================================

CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'super_admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);

-- RLS for user_profiles
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- ============================================
-- PART 3: PROFILES TABLE (Extended user data)
-- ============================================

CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    phone TEXT,
    avatar_url TEXT,
    preferences JSONB DEFAULT '{"sms": false, "whatsapp": false, "theme": "light"}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url')
  ON CONFLICT (id) DO NOTHING;
  
  INSERT INTO public.user_profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email)
  ON CONFLICT (id) DO NOTHING;
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- PART 4: ADDRESSES TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT DEFAULT 'Home',
    is_default BOOLEAN DEFAULT false,
    street TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    country TEXT DEFAULT 'Nigeria',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for addresses
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can insert own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can update own addresses" ON addresses;
DROP POLICY IF EXISTS "Users can delete own addresses" ON addresses;

CREATE POLICY "Users can view own addresses" ON addresses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses" ON addresses
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses" ON addresses
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses" ON addresses
    FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- PART 5: SAVED_ITEMS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS saved_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    item_type TEXT NOT NULL CHECK (item_type IN ('product', 'article')),
    item_id TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- RLS for saved_items
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own saved items" ON saved_items;
DROP POLICY IF EXISTS "Users can manage own saved items" ON saved_items;

CREATE POLICY "Users can view own saved items" ON saved_items
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own saved items" ON saved_items
    FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- PART 6: APPOINTMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type TEXT NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES user_profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(preferred_date);
CREATE INDEX IF NOT EXISTS idx_appointments_email ON appointments(email);

-- RLS for appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can create appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can read own appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can update own appointments" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can delete own appointments" ON appointments;
DROP POLICY IF EXISTS "Admins can manage all appointments" ON appointments;

CREATE POLICY "Anyone can create appointments" ON appointments
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can read own appointments" ON appointments
    FOR SELECT USING (email = auth.email());

CREATE POLICY "Authenticated users can update own appointments" ON appointments
    FOR UPDATE USING (email = auth.email());

CREATE POLICY "Authenticated users can delete own appointments" ON appointments
    FOR DELETE USING (email = auth.email());

CREATE POLICY "Admins can manage all appointments" ON appointments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- ============================================
-- PART 7: HEALTH_ARTICLES TABLE
-- ============================================

DROP TABLE IF EXISTS health_articles CASCADE;
CREATE TABLE IF NOT EXISTS health_articles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    image_url TEXT,
    category TEXT NOT NULL DEFAULT 'General',
    tags TEXT[] DEFAULT '{}',
    author_name TEXT DEFAULT 'Medomni Team',
    read_time_minutes INTEGER DEFAULT 5,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    published_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX IF NOT EXISTS idx_health_articles_slug ON health_articles(slug);
CREATE INDEX IF NOT EXISTS idx_health_articles_category ON health_articles(category);
CREATE INDEX IF NOT EXISTS idx_health_articles_published ON health_articles(is_published);

-- RLS for health_articles
ALTER TABLE health_articles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read published articles" ON health_articles;
DROP POLICY IF EXISTS "Admins can do anything with articles" ON health_articles;

CREATE POLICY "Public can read published articles" ON health_articles
    FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can do anything with articles" ON health_articles
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- ============================================
-- PART 8: NEWSLETTER_SUBSCRIBERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    is_active BOOLEAN DEFAULT true,
    source TEXT DEFAULT 'website',
    subscribed_at TIMESTAMPTZ DEFAULT NOW(),
    unsubscribed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active);

-- RLS for newsletter_subscribers
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can subscribe" ON newsletter_subscribers;
DROP POLICY IF EXISTS "Admins can manage subscribers" ON newsletter_subscribers;

CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage subscribers" ON newsletter_subscribers
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- ============================================
-- PART 9: FEEDBACK TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('suggestion', 'complaint', 'praise', 'question', 'bug')),
    message TEXT NOT NULL,
    email TEXT,
    name TEXT,
    page_url TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded', 'archived')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID REFERENCES user_profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);

-- RLS for feedback
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can submit feedback" ON feedback;
DROP POLICY IF EXISTS "Admins can manage feedback" ON feedback;

CREATE POLICY "Anyone can submit feedback" ON feedback
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage feedback" ON feedback
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- ============================================
-- PART 10: PRODUCTS TABLE
-- ============================================

DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    image TEXT,
    category TEXT,
    paystack_link TEXT,
    is_active BOOLEAN DEFAULT true,
    in_stock BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);

-- RLS for products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read available products" ON products;
DROP POLICY IF EXISTS "Admins can manage products" ON products;

CREATE POLICY "Public can read active products" ON products
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage products" ON products
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- ============================================
-- PART 11: CAROUSEL_SLIDES TABLE
-- ============================================

DROP TABLE IF EXISTS carousel_slides CASCADE;
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
    created_by UUID
);

CREATE INDEX IF NOT EXISTS idx_carousel_slides_order ON carousel_slides(display_order);
CREATE INDEX IF NOT EXISTS idx_carousel_slides_active ON carousel_slides(is_active);

-- RLS for carousel_slides
ALTER TABLE carousel_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active slides" ON carousel_slides;
DROP POLICY IF EXISTS "Admins can manage slides" ON carousel_slides;

CREATE POLICY "Public can read active slides" ON carousel_slides
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage slides" ON carousel_slides
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- ============================================
-- PART 12: CATEGORIES TABLE
-- ============================================

DROP TABLE IF EXISTS categories CASCADE;
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
    created_by UUID
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(display_order);

-- RLS for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active categories" ON categories;
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;

CREATE POLICY "Public can read active categories" ON categories
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON categories
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- ============================================
-- PART 13: NAVIGATION_LINKS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS navigation_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    label TEXT NOT NULL,
    href TEXT NOT NULL,
    icon TEXT,
    parent_id UUID REFERENCES navigation_links(id),
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_external BOOLEAN DEFAULT false,
    location TEXT DEFAULT 'header' CHECK (location IN ('header', 'footer', 'mobile')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_nav_links_location ON navigation_links(location);
CREATE INDEX IF NOT EXISTS idx_nav_links_order ON navigation_links(display_order);

-- RLS for navigation_links
ALTER TABLE navigation_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can read active nav links" ON navigation_links;
DROP POLICY IF EXISTS "Admins can manage nav links" ON navigation_links;

CREATE POLICY "Public can read active nav links" ON navigation_links
    FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage nav links" ON navigation_links
    FOR ALL USING (
        EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
    );

-- ============================================
-- PART 14: GRANTS
-- ============================================

GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON addresses TO authenticated;
GRANT ALL ON saved_items TO authenticated;
GRANT ALL ON appointments TO authenticated;
GRANT INSERT ON appointments TO anon;
GRANT ALL ON health_articles TO authenticated;
GRANT SELECT ON health_articles TO anon;
GRANT ALL ON newsletter_subscribers TO authenticated;
GRANT INSERT ON newsletter_subscribers TO anon;
GRANT ALL ON feedback TO authenticated;
GRANT INSERT ON feedback TO anon;
GRANT ALL ON products TO authenticated;
GRANT SELECT ON products TO anon;
GRANT ALL ON carousel_slides TO authenticated;
GRANT SELECT ON carousel_slides TO anon;
GRANT ALL ON categories TO authenticated;
GRANT SELECT ON categories TO anon;
GRANT ALL ON navigation_links TO authenticated;
GRANT SELECT ON navigation_links TO anon;

-- ============================================
-- PART 15: HELPER FUNCTION (is_admin)
-- ============================================

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM user_profiles
        WHERE id = auth.uid()
        AND role IN ('admin', 'super_admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- VERIFICATION - Run this to confirm success
-- ============================================

SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN (
    'user_profiles', 'profiles', 'addresses', 'saved_items',
    'appointments', 'health_articles', 'newsletter_subscribers',
    'feedback', 'products', 'carousel_slides', 'categories', 'navigation_links'
);

-- ============================================
-- MIGRATION COMPLETE! ✅
-- ============================================
-- 
-- NEXT STEPS:
-- 1. Update your app's .env file:
--    VITE_SUPABASE_URL=https://CLIENT_PROJECT.supabase.co
--    VITE_SUPABASE_ANON_KEY=CLIENT_ANON_KEY
--
-- 2. Configure Auth settings in Supabase Dashboard:
--    - Site URL
--    - Redirect URLs  
--    - Email templates
--
-- 3. Create an admin user:
--    - Sign up a new user
--    - Run: UPDATE user_profiles SET role = 'super_admin' WHERE email = 'admin@example.com';
--
-- ============================================
