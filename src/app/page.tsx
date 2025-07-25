'use client';
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { products as allProducts, categories } from '@/lib/mock-data';
import type { Product } from '@/lib/mock-data';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);

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

    setFilteredProducts(newFilteredProducts);
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setCategory('all');
    setFilteredProducts(allProducts);
  }

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-headline font-bold text-foreground">Explore the Marketplace</h1>
          <p className="text-lg text-muted-foreground mt-2">Find what you need, or rent what you don't.</p>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-md mb-12 flex flex-col md:flex-row gap-4 items-center">
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
            <SelectTrigger className="w-full md:w-[200px]">
              <SelectValue placeholder="Select Category" />
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
          <Button onClick={handleSearch} className="w-full md:w-auto bg-primary text-primary-foreground hover:bg-primary/90">
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>
          <Button onClick={clearFilters} variant="ghost" className="w-full md:w-auto">
            <X className="mr-2 h-4 w-4" /> Clear
          </Button>
        </div>

        {filteredProducts.length > 0 ? (
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
      </div>
    </div>
  );
}
