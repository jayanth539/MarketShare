export type Review = {
  user: string;
  avatar: string;
  rating: number;
  comment: string;
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
    name: string;
    avatar: string;
  };
  reviews: Review[];
};

export const products: Product[] = [
  {
    id: '1',
    title: 'Vintage Leather Sofa',
    description: 'A beautiful vintage leather sofa, perfect for adding a touch of classic style to any living room. Comfortably seats three people. Minor wear and tear consistent with age, but in great overall condition.',
    price: 450,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Furniture',
    type: 'sale',
    condition: 'used',
    seller: { name: 'Alice Johnson', avatar: 'https://placehold.co/100x100.png' },
    reviews: [
      { user: 'Bob', avatar: 'https://placehold.co/100x100.png', rating: 5, comment: 'Amazing sofa, exactly as described!' }
    ]
  },
  {
    id: '2',
    title: 'Modern City Apartment',
    description: 'Spacious 2-bedroom apartment in the heart of the city. Features a modern kitchen, balcony with a view, and access to a gym and pool. Available for short-term or long-term rent.',
    price: 2500,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Real Estate',
    type: 'rent',
    condition: 'used',
    seller: { name: 'Real Estate Co.', avatar: 'https://placehold.co/100x100.png' },
    reviews: [
      { user: 'Charlie', avatar: 'https://placehold.co/100x100.png', rating: 4, comment: 'Great location, but a bit noisy.' }
    ]
  },
  {
    id: '3',
    title: 'Smartphone X12',
    description: 'Latest model smartphone with a stunning OLED display, 128GB storage, and a pro-grade camera system. Unlocked and compatible with all major carriers. Brand new in box.',
    price: 899,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Electronics',
    type: 'sale',
    condition: 'new',
    seller: { name: 'Tech Resellers', avatar: 'https://placehold.co/100x100.png' },
    reviews: []
  },
  {
    id: '4',
    title: '2022 Sedan',
    description: 'A reliable and fuel-efficient 2022 sedan with low mileage. Perfect for city driving and road trips. Features include a rearview camera, Bluetooth connectivity, and advanced safety systems.',
    price: 150,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Vehicles',
    type: 'rent',
    condition: 'used',
    seller: { name: 'City Car Rentals', avatar: 'https://placehold.co/100x100.png' },
    reviews: [
      { user: 'Diana', avatar: 'https://placehold.co/100x100.png', rating: 5, comment: 'Clean car, easy rental process.' }
    ]
  },
  {
    id: '5',
    title: 'Stainless Steel Refrigerator',
    description: 'Large capacity stainless steel refrigerator with a built-in ice maker and water dispenser. Energy efficient and in excellent working condition. A few minor scratches on the side.',
    price: 600,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Appliances',
    type: 'sale',
    condition: 'used',
    seller: { name: 'Frank White', avatar: 'https://placehold.co/100x100.png' },
    reviews: []
  },
  {
    id: '6',
    title: 'Professional DSLR Camera Kit',
    description: 'Full DSLR camera kit available for rent. Includes camera body, 24-70mm lens, 50mm prime lens, two batteries, and a carrying case. Ideal for professional photoshoots or events.',
    price: 75,
    imageUrl: 'https://placehold.co/600x400.png',
    category: 'Electronics',
    type: 'rent',
    condition: 'used',
    seller: { name: 'Lens Masters', avatar: 'https://placehold.co/100x100.png' },
    reviews: [
       { user: 'Grace', avatar: 'https://placehold.co/100x100.png', rating: 5, comment: 'Great gear, very well maintained.' }
    ]
  }
];

export const categories: (Product['category'])[] = ['Electronics', 'Vehicles', 'Furniture', 'Appliances', 'Real Estate'];
