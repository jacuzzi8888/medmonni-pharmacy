-- ============================================
-- Phase 4: Complete Database Schema
-- Health Articles, Appointments, Feedback,
-- Navigation, Newsletter Subscribers
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. HEALTH ARTICLES TABLE
-- ============================================

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
  created_by UUID REFERENCES user_profiles(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_health_articles_slug ON health_articles(slug);
CREATE INDEX IF NOT EXISTS idx_health_articles_category ON health_articles(category);
CREATE INDEX IF NOT EXISTS idx_health_articles_published ON health_articles(is_published);
CREATE INDEX IF NOT EXISTS idx_health_articles_featured ON health_articles(is_featured);

-- ============================================
-- 2. APPOINTMENTS TABLE
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(preferred_date);
CREATE INDEX IF NOT EXISTS idx_appointments_service ON appointments(service_type);

-- ============================================
-- 3. FEEDBACK TABLE
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_feedback_type ON feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON feedback(created_at DESC);

-- ============================================
-- 4. NAVIGATION LINKS TABLE
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_nav_links_location ON navigation_links(location);
CREATE INDEX IF NOT EXISTS idx_nav_links_order ON navigation_links(display_order);
CREATE INDEX IF NOT EXISTS idx_nav_links_active ON navigation_links(is_active);

-- ============================================
-- 5. NEWSLETTER SUBSCRIBERS TABLE
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active);

-- ============================================
-- 6. ROW LEVEL SECURITY POLICIES
-- ============================================

-- Health Articles: Public read, Admin write
ALTER TABLE health_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published articles" ON health_articles
  FOR SELECT USING (is_published = true);

CREATE POLICY "Admins can do anything with articles" ON health_articles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Appointments: Users can create, admins can manage
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can create appointments" ON appointments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own appointments" ON appointments
  FOR SELECT USING (user_id = auth.uid() OR email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage all appointments" ON appointments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Feedback: Anyone can submit, admins can view/manage
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit feedback" ON feedback
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage feedback" ON feedback
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Navigation Links: Public read, admin write
ALTER TABLE navigation_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read active nav links" ON navigation_links
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage nav links" ON navigation_links
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- Newsletter: Anyone can subscribe, admins can view
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Subscribers can update own subscription" ON newsletter_subscribers
  FOR UPDATE USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "Admins can manage subscribers" ON newsletter_subscribers
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('admin', 'super_admin'))
  );

-- ============================================
-- 7. TRIGGERS FOR updated_at
-- ============================================

-- Apply to all new tables
DROP TRIGGER IF EXISTS update_health_articles_updated_at ON health_articles;
CREATE TRIGGER update_health_articles_updated_at
    BEFORE UPDATE ON health_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON appointments;
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_feedback_updated_at ON feedback;
CREATE TRIGGER update_feedback_updated_at
    BEFORE UPDATE ON feedback
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_navigation_links_updated_at ON navigation_links;
CREATE TRIGGER update_navigation_links_updated_at
    BEFORE UPDATE ON navigation_links
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 8. GRANTS
-- ============================================

GRANT ALL ON health_articles TO authenticated;
GRANT SELECT ON health_articles TO anon;

GRANT ALL ON appointments TO authenticated;
GRANT INSERT ON appointments TO anon;

GRANT ALL ON feedback TO authenticated;
GRANT INSERT ON feedback TO anon;

GRANT ALL ON navigation_links TO authenticated;
GRANT SELECT ON navigation_links TO anon;

GRANT ALL ON newsletter_subscribers TO authenticated;
GRANT INSERT ON newsletter_subscribers TO anon;

-- ============================================
-- 9. SAMPLE DATA (Optional)
-- ============================================

-- Sample Health Article
INSERT INTO health_articles (title, slug, excerpt, content, category, tags, is_featured)
VALUES (
  'Understanding Blood Pressure',
  'understanding-blood-pressure',
  'Learn the basics of blood pressure and how to maintain healthy levels.',
  'Blood pressure is the force of blood pushing against the walls of your arteries. High blood pressure, or hypertension, is a common condition that can lead to serious health problems if left untreated. Regular monitoring and lifestyle changes can help manage your blood pressure effectively.',
  'Heart Health',
  ARRAY['blood pressure', 'heart health', 'wellness'],
  true
) ON CONFLICT (slug) DO NOTHING;

-- Sample Navigation Links
INSERT INTO navigation_links (label, href, display_order, location) VALUES
  ('Home', '/', 1, 'header'),
  ('Shop', '/shop', 2, 'header'),
  ('Health Hub', '/health-hub', 3, 'header'),
  ('Services', '/services', 4, 'header'),
  ('Contact', '/contact', 5, 'header')
ON CONFLICT DO NOTHING;

-- ============================================
-- 10. VERIFICATION
-- ============================================

SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('health_articles', 'appointments', 'feedback', 'navigation_links', 'newsletter_subscribers');
