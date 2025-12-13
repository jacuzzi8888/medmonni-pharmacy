export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  image: string;
  img?: string; // Alias for backward compatibility with static data
  description?: string;
  paystack_link: string;
  is_active: boolean;
  in_stock: boolean;
  is_featured: boolean;
  created_at?: string;
  updated_at?: string;

  // Legacy fields (optional, for backward compatibility if needed temporarily)
  fullDescription?: string;
  dosage?: string;
  ingredients?: string;
  badge?: string | null;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  price: number;
  category: string;
  image: string;
  description?: string;
  paystack_link: string;
  is_active?: boolean;
  in_stock?: boolean;
  is_featured?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> { }
