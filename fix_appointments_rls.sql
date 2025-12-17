-- =====================================================
-- RUN THIS IN SUPABASE SQL EDITOR
-- Fixes appointments RLS - SIMPLIFIED VERSION
-- =====================================================

-- Enable RLS on appointments
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies on appointments
DROP POLICY IF EXISTS "Users can read own appointments by email" ON appointments;
DROP POLICY IF EXISTS "Allow public appointment creation" ON appointments;
DROP POLICY IF EXISTS "Users can read own appointments" ON appointments;
DROP POLICY IF EXISTS "Anyone can create appointments" ON appointments;
DROP POLICY IF EXISTS "Enable insert for all users" ON appointments;
DROP POLICY IF EXISTS "Authenticated users can read own appointments" ON appointments;
DROP POLICY IF EXISTS "Users can update own appointments" ON appointments;

-- 1. ALLOW ANYONE TO CREATE APPOINTMENTS
CREATE POLICY "Anyone can create appointments"
    ON appointments FOR INSERT
    WITH CHECK (true);

-- 2. ALLOW AUTHENTICATED USERS TO READ THEIR APPOINTMENTS (using auth.email())
CREATE POLICY "Authenticated users can read own appointments"
    ON appointments FOR SELECT
    USING (email = auth.email());

-- 3. ALLOW USERS TO UPDATE (CANCEL) THEIR OWN APPOINTMENTS
CREATE POLICY "Users can update own appointments"
    ON appointments FOR UPDATE
    USING (email = auth.email());
