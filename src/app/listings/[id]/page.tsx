'use client';
import { useState } from 'react';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { products } from '@/lib/mock-data';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RentalCalendar from '@/components/RentalCalendar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, MessageCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);
  const [listingType, setListingType] = useState(product?.type || 'sale');

  if (!product) {
    notFound();
  }

  const handleTypeChange = (isRent: boolean) => {
    setListingType(isRent ? 'rent' : 'sale');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
        {/* Left Column: Image */}
        <div className="bg-card p-4 rounded-lg shadow-md">
          <Image
            src={product.imageUrl}
            alt={product.title}
            width={800}
            height={600}
            className="w-full rounded-lg object-cover"
            data-ai-hint={`${product.category} ${product.title}`}
          />
        </div>

        {/* Right Column: Details */}
        <div>
          <h1 className="text-4xl font-headline font-bold mb-2">{product.title}</h1>
          <div className="flex items-center gap-4 mb-4 text-muted-foreground">
            <span className="capitalize">{product.category}</span>
            <span className="capitalize">&bull; {product.condition}</span>
          </div>
          <p className="text-3xl font-semibold text-primary mb-6">
            ${product.price.toLocaleString()}
            {listingType === 'rent' && <span className="text-base font-normal text-muted-foreground"> / day</span>}
          </p>
          <p className="text-lg leading-relaxed mb-8">{product.description}</p>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Switch 
                  id="listing-type" 
                  checked={listingType === 'rent'}
                  onCheckedChange={handleTypeChange}
                  aria-label="Toggle between sale and rent"
                />
                <Label htmlFor="listing-type" className="text-lg">
                  {listingType === 'rent' ? 'For Rent' : 'For Sale'}
                </Label>
              </div>

              {listingType === 'rent' ? (
                <div>
                  <h3 className="text-xl font-headline mb-4">Select Rental Dates</h3>
                  <RentalCalendar />
                  <Button size="lg" className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90">Request to Book</Button>
                </div>
              ) : (
                <Button size="lg" className="w-full">Buy Now</Button>
              )}
            </CardContent>
          </Card>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="font-headline">Seller Information</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center gap-4">
              <Avatar>
                <AvatarImage src={product.seller.avatar} alt={product.seller.name} />
                <AvatarFallback>{product.seller.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{product.seller.name}</p>
                <Button variant="link" className="p-0 h-auto">Contact Seller</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-headline font-bold mb-6 flex items-center">
          <MessageCircle className="mr-3 text-primary" /> Reviews ({product.reviews.length})
        </h2>
        <div className="space-y-8">
          {product.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
              <div key={index}>
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={review.avatar} alt={review.user} />
                    <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold">{review.user}</p>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-5 w-5 ${i < review.rating ? 'text-accent fill-accent' : 'text-muted-foreground'}`} />
                        ))}
                      </div>
                    </div>
                    <p>{review.comment}</p>
                  </div>
                </div>
                {index < product.reviews.length - 1 && <Separator className="mt-6" />}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No reviews yet for this product.</p>
          )}
        </div>
      </div>
    </div>
  );
}
