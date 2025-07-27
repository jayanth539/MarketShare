export type Review = {
  id: string;
  product_id: string;
  user_id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  created_at: string;
};

export type Product = {
  id: string;
  title:string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'Electronics' | 'Vehicles' | 'Furniture' | 'Appliances' | 'Real Estate';
  type: 'sale' | 'rent';
  condition: 'new' | 'used';
  seller: {
    id: string;
    name: string;
    avatar: string;
  };
  created_at: string;
};

export const categories: (Product['category'])[] = ['Electronics', 'Vehicles', 'Furniture', 'Appliances', 'Real Estate'];
