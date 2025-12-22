-- Fix for 403 error when submitting reviews/feedback
-- The feedback table needs RLS policies to allow public submission

-- First, add the is_featured column if it doesn't exist
ALTER TABLE feedback ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Enable RLS on feedback table (if not already enabled)
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- DROP existing policies if they exist (to recreate them)
DROP POLICY IF EXISTS "Allow public to submit feedback" ON feedback;
DROP POLICY IF EXISTS "Allow admins to read all feedback" ON feedback;
DROP POLICY IF EXISTS "Allow admins to update feedback" ON feedback;
DROP POLICY IF EXISTS "Allow admins to delete feedback" ON feedback;

-- Policy 1: Allow anyone (authenticated or anonymous) to INSERT feedback
CREATE POLICY "Allow public to submit feedback" ON feedback
    FOR INSERT
    WITH CHECK (true);  -- Allow all inserts

-- Policy 2: Allow admins to read all feedback
CREATE POLICY "Allow admins to read all feedback" ON feedback
    FOR SELECT
    USING (
        auth.role() = 'authenticated' 
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Policy 3: Allow admins to update feedback (for marking as featured, read, etc.)
CREATE POLICY "Allow admins to update feedback" ON feedback
    FOR UPDATE
    USING (
        auth.role() = 'authenticated' 
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Policy 4: Allow admins to delete feedback
CREATE POLICY "Allow admins to delete feedback" ON feedback
    FOR DELETE
    USING (
        auth.role() = 'authenticated' 
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = auth.uid() 
            AND profiles.role = 'admin'
        )
    );

-- Policy 5: Allow public to read ONLY featured feedback (for testimonials display)
CREATE POLICY "Allow public to read featured feedback" ON feedback
    FOR SELECT
    USING (is_featured = true);
