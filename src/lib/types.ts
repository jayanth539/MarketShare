import { FieldValue } from "firebase/firestore";

export type Review = {
  userId: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  createdAt: FieldValue | Date;
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
  reviews: Review[];
  createdAt: FieldValue;
};

export const categories: (Product['category'])[] = ['Electronics', 'Vehicles', 'Furniture', 'Appliances', 'Real Estate'];
