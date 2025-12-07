export interface Product {
  id: string;
  name: string;
  price: string;
  description: string;
  fullDescription?: string;
  dosage?: string;
  ingredients?: string;
  img: string;
  paystackLink: string;
  badge?: string | null;
  category: string;
}
