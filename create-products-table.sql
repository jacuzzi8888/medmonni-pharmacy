
-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    price NUMERIC NOT NULL DEFAULT 0,
    category TEXT NOT NULL,
    image TEXT NOT NULL,
    description TEXT,
    paystack_link TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    in_stock BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active products
CREATE POLICY "Allow public read access" ON products
FOR SELECT USING (true);

-- Allow authenticated users (admins) to insert products
CREATE POLICY "Allow admin insert" ON products
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users (admins) to update products
CREATE POLICY "Allow admin update" ON products
FOR UPDATE USING (auth.role() = 'authenticated');

-- Allow authenticated users (admins) to delete products
CREATE POLICY "Allow admin delete" ON products
FOR DELETE USING (auth.role() = 'authenticated');

-- Ensure storage bucket exists and has policies
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Drop existing policies to avoid conflicts if re-running
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
