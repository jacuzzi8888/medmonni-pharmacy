-- ============================================
-- RLS Performance & Policy Fixes
-- Run this in Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. FIX PRODUCTS TABLE - Performance Issue
-- Wrap auth.role() in (select ...) for better performance
-- ============================================

-- Drop existing policies
DROP POLICY IF EXISTS "Allow admin insert" ON products;
DROP POLICY IF EXISTS "Allow admin update" ON products;
DROP POLICY IF EXISTS "Allow admin delete" ON products;
DROP POLICY IF EXISTS "Allow public read access" ON products;

-- Recreate with optimized auth function calls
CREATE POLICY "Allow public read access" ON products
  FOR SELECT USING (true);

CREATE POLICY "Allow admin insert" ON products
  FOR INSERT WITH CHECK ((select auth.role()) = 'authenticated' OR (select auth.role()) = 'service_role');

CREATE POLICY "Allow admin update" ON products
  FOR UPDATE USING ((select auth.role()) = 'authenticated' OR (select auth.role()) = 'service_role');

CREATE POLICY "Allow admin delete" ON products
  FOR DELETE USING ((select auth.role()) = 'authenticated' OR (select auth.role()) = 'service_role');

-- ============================================
-- 2. FIX CAROUSEL_SLIDES TABLE - Duplicate Policies
-- Consolidate into single policies per action
-- ============================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can manage carousel slides" ON carousel_slides;
DROP POLICY IF EXISTS "Public can view active carousel slides" ON carousel_slides;
DROP POLICY IF EXISTS "Allow public read" ON carousel_slides;
DROP POLICY IF EXISTS "Allow admin write" ON carousel_slides;

-- Create consolidated policies
CREATE POLICY "carousel_select" ON carousel_slides
  FOR SELECT USING (
    is_active = true 
    OR EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = (select auth.uid()) 
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "carousel_insert" ON carousel_slides
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = (select auth.uid()) 
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "carousel_update" ON carousel_slides
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = (select auth.uid()) 
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "carousel_delete" ON carousel_slides
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = (select auth.uid()) 
      AND role IN ('admin', 'super_admin')
    )
  );

-- ============================================
-- 3. FIX CATEGORIES TABLE - Duplicate Policies
-- Consolidate into single policies per action
-- ============================================

-- Drop all existing policies
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Public can view active categories" ON categories;
DROP POLICY IF EXISTS "Allow public read" ON categories;
DROP POLICY IF EXISTS "Allow admin write" ON categories;

-- Create consolidated policies
CREATE POLICY "categories_select" ON categories
  FOR SELECT USING (
    is_active = true 
    OR EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = (select auth.uid()) 
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "categories_insert" ON categories
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = (select auth.uid()) 
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "categories_update" ON categories
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = (select auth.uid()) 
      AND role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "categories_delete" ON categories
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = (select auth.uid()) 
      AND role IN ('admin', 'super_admin')
    )
  );

-- ============================================
-- 4. FIX USER_PROFILES TABLE - Duplicate Policies
-- Remove service_role_full_access (not needed, service_role bypasses RLS)
-- ============================================

-- Drop all existing policies
DROP POLICY IF EXISTS "service_role_full_access" ON user_profiles;
DROP POLICY IF EXISTS "users_insert_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_read_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
DROP POLICY IF EXISTS "Super admins can update any profile" ON user_profiles;

-- Create clean consolidated policies
-- Note: service_role automatically bypasses RLS, so we don't need a policy for it

CREATE POLICY "profiles_select" ON user_profiles
  FOR SELECT USING (
    -- Users can read their own profile
    (select auth.uid()) = id
    -- OR user is admin (can see all)
    OR EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = (select auth.uid()) 
      AND up.role IN ('admin', 'super_admin')
    )
  );

CREATE POLICY "profiles_insert" ON user_profiles
  FOR INSERT WITH CHECK (
    -- Users can only insert their own profile
    (select auth.uid()) = id
  );

CREATE POLICY "profiles_update" ON user_profiles
  FOR UPDATE USING (
    -- Users can update their own profile
    (select auth.uid()) = id
    -- OR super_admin can update any
    OR EXISTS (
      SELECT 1 FROM user_profiles up 
      WHERE up.id = (select auth.uid()) 
      AND up.role = 'super_admin'
    )
  );

-- ============================================
-- VERIFICATION
-- ============================================

-- Check policies after fix
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
