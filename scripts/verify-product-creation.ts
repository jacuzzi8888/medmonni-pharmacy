
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyProductCreation() {
    console.log('Verifying product creation...');

    // 1. Check for existing test product
    console.log('Checking for existing "test-product"...');
    const { data: existing } = await supabase
        .from('products')
        .select('*')
        .eq('slug', 'test-product')
        .maybeSingle();

    console.log(`Slug "test-product" exists: ${!!existing}`);

    if (existing) {
        console.log('Found product:', existing);
    } else {
        console.log('Product does not exist. Attempting to create...');
        const { data: newProduct, error } = await supabase
            .from('products')
            .insert({
                name: 'Script Test Product',
                slug: 'script-test-product',
                price: 500,
                category: 'Wellness',
                image: 'https://via.placeholder.com/150',
                description: 'Created via verification script',
                paystack_link: 'https://paystack.com/buy/test',
                is_active: true,
                in_stock: true,
                is_featured: false
            })
            .select()
            .single();

        if (error) {
            console.error('Failed to create product:', error);
        } else {
            console.log('Successfully created product:', newProduct);
        }
    }
}

verifyProductCreation();
