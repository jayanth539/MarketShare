
'use client';
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X, ShoppingCart, Repeat, Users } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { categories } from '@/lib/types';
import type { Product } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

function Marketplace() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [condition, setCondition] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
      } else {
        setAllProducts(data as Product[]);
        setFilteredProducts(data as Product[]);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  const handleSearch = () => {
    let newFilteredProducts = allProducts;

    if (searchTerm) {
      newFilteredProducts = newFilteredProducts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (category !== 'all') {
      newFilteredProducts = newFilteredProducts.filter(p => p.category === category);
    }

    if (condition !== 'all') {
        newFilteredProducts = newFilteredProducts.filter(p => p.condition === condition);
    }

    if (minPrice) {
        newFilteredProducts = newFilteredProducts.filter(p => p.price >= parseFloat(minPrice));
    }

    if (maxPrice) {
        newFilteredProducts = newFilteredProducts.filter(p => p.price <= parseFloat(maxPrice));
    }

    setFilteredProducts(newFilteredProducts);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setCondition('all');
    setMinPrice('');
    setMaxPrice('');
    setFilteredProducts(allProducts);
  }
  
  return (
     <>
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">Explore the Marketplace</h1>
          <p className="text-lg text-muted-foreground mt-2">Find what you need, or rent what you don't.</p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md mb-12 flex flex-col md:flex-row flex-wrap gap-4 items-center">
          <div className="relative w-full md:flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for items..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
           <Select value={condition} onValueChange={setCondition}>
            <SelectTrigger className="w-full md:w-[120px]">
              <SelectValue placeholder="Condition" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="used">Used</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2 w-full md:w-auto">
            <Input
              type="number"
              placeholder="Min Price"
              className="w-full"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Max Price"
              className="w-full"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>
          <Button onClick={handleSearch} className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
          <Button onClick={clearFilters} variant="ghost" className="w-full md:w-auto">
            <X className="mr-2 h-4 w-4" /> Clear
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
                <Card key={i}>
                    <Skeleton className="h-[225px] w-full" />
                    <CardContent className="p-4 space-y-2">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                    </CardContent>
                </Card>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-headline font-semibold">No Products Found</h2>
            <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
          </div>
        )}
      </>
  );
}

function LandingPage() {
  return (
    <div className="text-center py-16 md:py-24">
      <h1 className="text-4xl md:text-6xl font-headline font-bold text-foreground">Welcome to MarketShare</h1>
      <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">The modern marketplace for buying, selling, and renting goods with your community. Your next great find is just a click away.</p>
      <div className="mt-8">
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/login">Get Started</Link>
          </Button>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-headline font-semibold">Buy & Sell</h3>
              <p className="mt-2 text-muted-foreground">Easily list your items or discover a wide range of products from electronics to furniture.</p>
          </div>
           <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <Repeat className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-headline font-semibold">Rent Anything</h3>
              <p className="mt-2 text-muted-foreground">Need something short-term? Rent tools, equipment, or even real estate without the commitment.</p>
          </div>
           <div className="flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="mt-4 text-xl font-headline font-semibold">Community First</h3>
              <p className="mt-2 text-muted-foreground">Connect with sellers and buyers in a trusted, community-focused environment.</p>
          </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, loading } = useAuth();
  
  if (loading) {
     return (
        <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {[...Array(8)].map((_, i) => (
                    <Card key={i}>
                        <Skeleton className="h-[225px] w-full" />
                        <CardContent className="p-4 space-y-2">
                            <Skeleton className="h-6 w-3/4" />
                            <Skeleton className="h-5 w-1/2" />
                            <Skeleton className="h-4 w-1/4" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
     );
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        {user ? <Marketplace /> : <LandingPage />}
      </div>
    </div>
  );
}
