'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams, notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { categories } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';

const listingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  price: z.coerce.number().min(0.01, 'Price must be positive.'),
  category: z.string({ required_error: 'Please select a category.' }),
  type: z.enum(['sale', 'rent'], { required_error: 'You must select a listing type.' }),
  condition: z.enum(['new', 'used'], { required_error: 'Please select a condition.'}),
});

type ListingFormValues = z.infer<typeof listingSchema>;

export default function EditListingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
  });
  
  useEffect(() => {
    if (typeof id !== 'string') return;
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        toast({ title: "Product not found", variant: 'destructive' });
        notFound();
        return;
      }
      
      if (user && data.seller.id !== user.uid) {
        toast({ title: "Unauthorized", description: "You cannot edit this listing.", variant: 'destructive' });
        router.push('/');
        return;
      }

      setProduct(data as Product);
      form.reset({
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category,
        type: data.type,
        condition: data.condition,
      });
    };
    fetchProduct();
  }, [id, user, router, toast, form]);


  async function onSubmit(data: ListingFormValues) {
    if (!user || !product) return;
    
    setIsSubmitting(true);

    try {
        const updatedProduct = {
            title: data.title,
            description: data.description,
            price: data.price,
            category: data.category,
            type: data.type,
            condition: data.condition,
        };

        const { error } = await supabase
            .from('products')
            .update(updatedProduct)
            .eq('id', product.id);

        if (error) {
          throw new Error(`Supabase update error: ${error.message}`);
        }

        toast({
            title: 'Listing Updated!',
            description: 'Your item has been successfully updated.',
        });
        
        router.push(`/listings/${product.id}`);

    } catch (error: any) {
        console.error("Error updating listing: ", error);
        toast({ 
          title: 'Error Updating Listing', 
          description: error.message || 'An unknown error occurred.',
          variant: 'destructive' 
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  if (!product) {
      return (
          <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
      )
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            <div className="mt-4">
                <Image src={product.image_url!} alt={product.title} width={200} height={200} className="rounded-md object-cover" />
                <p className="text-sm text-muted-foreground mt-2">The photo cannot be changed after creation.</p>
            </div>
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Vintage Leather Sofa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your item in detail..." className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="e.g., 450.00" {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Condition</FormLabel>
                     <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex items-center space-x-4 pt-2"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="new" />
                          </FormControl>
                          <FormLabel className="font-normal">New</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="used" />
                          </FormControl>
                          <FormLabel className="font-normal">Used</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
             <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing Type</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex items-center space-x-4 pt-2"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="sale" />
                          </FormControl>
                          <FormLabel className="font-normal">For Sale</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="rent" />
                          </FormControl>
                          <FormLabel className="font-normal">For Rent</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            
            <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
