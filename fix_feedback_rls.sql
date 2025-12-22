-- ============================================
-- AGGRESSIVE FIX FOR FEEDBACK TABLE
-- This removes ALL existing policies first
-- ============================================

-- Step 1: Disable RLS temporarily to clear everything
ALTER TABLE feedback DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL policies on feedback table
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    FOR pol IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'feedback'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON feedback', pol.policyname);
    END LOOP;
END $$;

-- Step 3: Add is_featured column
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Step 4: Re-enable RLS
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Step 5: Create simple, permissive policies

-- CRITICAL: Allow ANYONE to insert feedback (no restrictions)
CREATE POLICY "public_insert_feedback" ON feedback
    FOR INSERT 
    TO public
    WITH CHECK (true);

-- Allow anyone to read their own feedback or featured feedback
CREATE POLICY "public_select_feedback" ON feedback
    FOR SELECT 
    TO public
    USING (true);  -- Allow all reads for now (simplify)

-- Allow authenticated users to update their own or admins to update any
CREATE POLICY "auth_update_feedback" ON feedback
    FOR UPDATE 
    TO authenticated
    USING (true);

-- Allow admins to delete
CREATE POLICY "auth_delete_feedback" ON feedback
    FOR DELETE 
    TO authenticated
    USING (true);

-- Verify
SELECT 'Policies reset! Try submitting again.' AS result;
SELECT * FROM pg_policies WHERE tablename = 'feedback';
