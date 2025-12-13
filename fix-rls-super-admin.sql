
-- Drop existing policies first to avoid errors
DROP POLICY IF EXISTS "Allow public read access" ON products;
DROP POLICY IF EXISTS "Allow admin insert" ON products;
DROP POLICY IF EXISTS "Allow admin update" ON products;
DROP POLICY IF EXISTS "Allow admin delete" ON products;

-- Allow public read access to active products
CREATE POLICY "Allow public read access" ON products
FOR SELECT USING (true);

-- Allow authenticated users (admins) to insert products
CREATE POLICY "Allow admin insert" ON products
FOR INSERT WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Allow authenticated users (admins) to update products
CREATE POLICY "Allow admin update" ON products
FOR UPDATE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Allow authenticated users (admins) to delete products
CREATE POLICY "Allow admin delete" ON products
FOR DELETE USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Storage policies (re-apply to be safe)
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Auth Upload" ON storage.objects;
DROP POLICY IF EXISTS "Auth Update" ON storage.objects;
DROP POLICY IF EXISTS "Auth Delete" ON storage.objects;

CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Auth Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));
CREATE POLICY "Auth Update" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));
CREATE POLICY "Auth Delete" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND (auth.role() = 'authenticated' OR auth.role() = 'service_role'));

-- Also re-insert test product
INSERT INTO products (name, slug, price, category, image, description, paystack_link)
VALUES ('Manual Test Product', 'manual-test', 1500, 'Wellness', 'https://via.placeholder.com/150', 'Inserted via SQL', 'https://paystack.com/buy/test')
ON CONFLICT (slug) DO NOTHING;
