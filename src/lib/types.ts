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
  image_url: string | null;
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

export type Request = {
  id: string;
  product_id: string;
  buyer_id: string;
  buyer_name: string;
  seller_id: string;
  request_type: 'sale' | 'rent';
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  products: Product; // This will be populated by the join query
};


export const categories: (Product['category'])[] = ['Electronics', 'Vehicles', 'Furniture', 'Appliances', 'Real Estate'];
