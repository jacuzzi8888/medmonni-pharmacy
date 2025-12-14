-- ============================================
-- FIX: User Profiles RLS for Admin Access
-- The previous RLS policy was blocking profile lookups
-- Run this in Supabase SQL Editor
-- ============================================

-- First, drop the problematic policies
DROP POLICY IF EXISTS "profiles_select" ON user_profiles;
DROP POLICY IF EXISTS "profiles_insert" ON user_profiles;
DROP POLICY IF EXISTS "profiles_update" ON user_profiles;

-- Create permissive SELECT policy that allows:
-- 1. Users to read their own profile
-- 2. Any authenticated user to look up profiles (needed for admin checks)
CREATE POLICY "profiles_select" ON user_profiles
  FOR SELECT USING (
    -- Allow authenticated users to select profiles (needed for admin lookup)
    (select auth.role()) = 'authenticated'
    -- OR allow service role
    OR (select auth.role()) = 'service_role'
  );

-- INSERT: Users can only insert their own profile
CREATE POLICY "profiles_insert" ON user_profiles
  FOR INSERT WITH CHECK (
    (select auth.uid()) = id
  );

-- UPDATE: Users can update their own profile, super_admins can update any
CREATE POLICY "profiles_update" ON user_profiles
  FOR UPDATE USING (
    -- Users update their own
    (select auth.uid()) = id
    -- OR super_admin can update any (lookup via subquery to avoid recursion)
    OR (
      SELECT role FROM user_profiles WHERE id = (select auth.uid())
    ) = 'super_admin'
  );

-- ============================================
-- Verify the policies
-- ============================================
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies 
WHERE tablename = 'user_profiles';

-- ============================================
-- TEST: Check if your user can access their profile
-- Replace with your actual user ID or run as logged-in user
-- ============================================
-- SELECT * FROM user_profiles WHERE id = auth.uid();
