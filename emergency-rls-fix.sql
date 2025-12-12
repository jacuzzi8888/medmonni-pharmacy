-- ============================================
-- EMERGENCY FIX: Temporarily disable RLS to test
-- This will confirm if RLS is causing the issue
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Disable RLS on user_profiles (TEMPORARY FOR TESTING)
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Ensure role column exists
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';

-- Step 3: Set admin role
UPDATE public.user_profiles 
SET role = 'super_admin' 
WHERE email = 'coolguyben126@gmail.com';

-- Step 4: Verify
SELECT id, email, role FROM public.user_profiles;

-- ============================================
-- IF THIS WORKS, run the following to re-enable RLS
-- with proper policies:
-- ============================================

-- -- Re-enable RLS
-- ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
-- 
-- -- Simple read policy
-- DROP POLICY IF EXISTS "allow_read_own" ON public.user_profiles;
-- CREATE POLICY "allow_read_own" ON public.user_profiles
--     FOR SELECT USING (auth.uid() = id);
-- 
-- -- Simple update policy  
-- DROP POLICY IF EXISTS "allow_update_own" ON public.user_profiles;
-- CREATE POLICY "allow_update_own" ON public.user_profiles
--     FOR UPDATE USING (auth.uid() = id);
-- 
-- -- Simple insert policy
-- DROP POLICY IF EXISTS "allow_insert_own" ON public.user_profiles;
-- CREATE POLICY "allow_insert_own" ON public.user_profiles
--     FOR INSERT WITH CHECK (auth.uid() = id);
