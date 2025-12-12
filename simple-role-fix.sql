-- ============================================
-- SIMPLE FIX FOR USER ROLES - NO RLS CHANGES
-- Just ensures the role column exists and is set
-- Run this in Supabase SQL Editor
-- ============================================

-- Step 1: Check if role column exists, add if not
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'customer';

-- Step 2: Set all NULL roles to 'customer'
UPDATE public.user_profiles 
SET role = 'customer' 
WHERE role IS NULL;

-- Step 3: Set your user as super_admin
UPDATE public.user_profiles 
SET role = 'super_admin' 
WHERE email = 'coolguyben126@gmail.com';

-- Step 4: Verify the result
SELECT id, email, role FROM public.user_profiles 
WHERE email = 'coolguyben126@gmail.com';
