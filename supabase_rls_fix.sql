-- Medomni Pharmacy - Supabase RLS Fix for Bug #7
-- Apply this in Supabase Dashboard -> SQL Editor

-- Drop existing insert policy if it exists
DROP POLICY IF EXISTS "Allow public appointment creation" ON appointments;

-- Allow public (including anonymous) to insert appointments
-- This is the main fix for Bug #7
CREATE POLICY "Allow public appointment creation"
ON appointments FOR INSERT
WITH CHECK (true);

-- Optional: Allow anyone to read appointments where user_id is null (anonymous bookings)
DROP POLICY IF EXISTS "Allow reading anonymous appointments" ON appointments;
CREATE POLICY "Allow reading anonymous appointments"
ON appointments FOR SELECT
USING (user_id IS NULL OR auth.uid() = user_id);
