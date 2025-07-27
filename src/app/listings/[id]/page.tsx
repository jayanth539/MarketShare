'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { notFound, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import RentalCalendar from '@/components/RentalCalendar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Star, MessageCircle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { Product, Review } from '@/lib/types';

export default function ListingDetailPage() {
  const params = useParams();
  const { id } = params;
  const { user } = useAuth();
  const { toast } = useToast();

  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [listingType, setListingType] = useState<'sale' | 'rent'>('sale');
  const [newReview, setNewReview] = useState('');
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof id !== 'string') return;
    const fetchProductAndReviews = async () => {
      setLoading(true);
      
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (productError || !productData) {
        console.error('Error fetching product:', productError);
        notFound();
        return;
      }
      
      setProduct(productData as Product);
      setListingType(productData.type);

      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', id)
        .order('created_at', { ascending: false });

      if (reviewsError) {
        console.error('Error fetching reviews:', reviewsError);
      } else {
        setReviews(reviewsData as Review[]);
      }
      
      setLoading(false);
    };

    fetchProductAndReviews();
  }, [id]);

  const handleTypeChange = (isRent: boolean) => {
    setListingType(isRent ? 'rent' : 'sale');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || typeof id !== 'string') {
        toast({ title: "You must be logged in to leave a review.", variant: 'destructive'});
        return;
    }
    if (!newReview.trim() || rating === 0) {
        toast({ title: "Please write a review and select a rating.", variant: 'destructive'});
        return;
    }

    const reviewData = {
        product_id: id,
        user_id: user.uid,
        user: user.displayName || 'Anonymous',
        avatar: user.photoURL || 'https://placehold.co/100x100.png',
        rating,
        comment: newReview,
    };
    
    const { data, error } = await supabase
        .from('reviews')
        .insert([reviewData])
        .select();

    if (error) {
        console.error('Error submitting review', error);
        toast({ title: "Failed to submit review.", variant: 'destructive'});
        return;
    }

    setReviews(prev => [data[0] as Review, ...prev]);
    setNewReview('');
    setRating(0);
    toast({ title: "Review submitted!"});
  }

  if (loading || !product) {
    return <div className="container mx-auto px-4 py-12">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12 items-start">
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

      <div className="mt-16">
        <h2 className="text-3xl font-headline font-bold mb-6 flex items-center">
          <MessageCircle className="mr-3 text-primary" /> Reviews ({reviews.length})
        </h2>
        <div className="space-y-8">
          {reviews.length > 0 ? (
            reviews.map((review, index) => (
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
                {index < reviews.length - 1 && <Separator className="mt-6" />}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">No reviews yet for this product.</p>
          )}
        </div>
        
        {user && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Leave a Review</CardTitle>
            </CardHeader>
            <form onSubmit={handleReviewSubmit}>
                <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Your Rating:</span>
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star 
                                    key={i} 
                                    className={`h-6 w-6 cursor-pointer ${i < rating ? 'text-accent fill-accent' : 'text-muted-foreground'}`}
                                    onClick={() => setRating(i + 1)}
                                />
                            ))}
                        </div>
                    </div>
                    <Textarea 
                        placeholder="Share your thoughts..."
                        value={newReview}
                        onChange={(e) => setNewReview(e.target.value)}
                    />
                </CardContent>
                <CardFooter>
                    <Button type="submit">Submit Review</Button>
                </CardFooter>
            </form>
          </Card>
        )}

      </div>
    </div>
  );
}
