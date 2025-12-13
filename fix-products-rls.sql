
-- Enable RLS on products table
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

-- Also ensure storage bucket policies are correct
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
