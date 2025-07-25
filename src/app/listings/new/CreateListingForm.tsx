
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { generateListingDetails } from '@/ai/flows/generate-listing-details';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { categories } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';
import type { Product } from '@/lib/types';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const listingSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters.'),
  description: z.string().min(20, 'Description must be at least 20 characters.'),
  price: z.coerce.number().min(0.01, 'Price must be positive.'),
  category: z.string({ required_error: 'Please select a category.' }),
  type: z.enum(['sale', 'rent'], { required_error: 'You must select a listing type.' }),
  condition: z.enum(['new', 'used'], { required_error: 'Please select a condition.'}),
  photo: z.instanceof(File).refine(file => file.size > 0, 'Photo is required.'),
});

type ListingFormValues = z.infer<typeof listingSchema>;

export default function CreateListingForm() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoDataUri, setPhotoDataUri] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const form = useForm<ListingFormValues>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: '',
      description: '',
      price: undefined,
      category: undefined,
      type: 'sale',
      condition: 'new',
    },
  });

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('photo', file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        setPhotoDataUri(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateDetails = async () => {
    const category = form.getValues('category');
    if (!photoDataUri || !category) {
      toast({
        title: 'Missing Information',
        description: 'Please upload a photo and select a category first.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    try {
      const result = await generateListingDetails({ photoDataUri, category });
      form.setValue('title', result.title, { shouldValidate: true });
      form.setValue('description', result.description, { shouldValidate: true });
      toast({
        title: 'Details Generated!',
        description: 'The AI has suggested a title and description for you.',
      });
    } catch (error) {
      console.error('AI generation failed:', error);
      toast({
        title: 'Generation Failed',
        description: 'Could not generate details. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  async function onSubmit(data: ListingFormValues) {
    if (!user) {
      toast({ title: 'You must be logged in to create a listing.', variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);

    try {
        const photoFile = data.photo;
        const storageRef = ref(storage, `listings/${user.uid}/${Date.now()}_${photoFile.name}`);
        
        await uploadBytes(storageRef, photoFile);

        const imageUrl = await getDownloadURL(storageRef);

        const newProduct: Omit<Product, 'id' | 'reviews'> = {
            title: data.title,
            description: data.description,
            price: data.price,
            imageUrl: imageUrl,
            category: data.category as Product['category'],
            type: data.type,
            condition: data.condition,
            seller: { 
                id: user.uid,
                name: user.displayName || 'Anonymous', 
                avatar: user.photoURL || 'https://placehold.co/100x100.png' 
            },
            createdAt: serverTimestamp(),
        };

        const docRef = await addDoc(collection(db, 'products'), newProduct);

        toast({
            title: 'Listing Created!',
            description: 'Your item is now live on the marketplace.',
        });
        
        router.push(`/listings/${docRef.id}`);

    } catch (error: any) {
        console.error("Error creating listing: ", error);
        toast({ 
          title: 'Error creating listing', 
          description: error.message || 'An unknown error occurred. Please check the console.', 
          variant: 'destructive' 
        });
    } finally {
        setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Photo</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={handlePhotoChange} />
                  </FormControl>
                  {photoPreview && (
                    <div className="mt-4">
                      <Image src={photoPreview} alt="Preview" width={200} height={200} className="rounded-md object-cover" />
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

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

            <Button
              type="button"
              onClick={handleGenerateDetails}
              disabled={isGenerating || !photoDataUri || !form.watch('category')}
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate with AI
            </Button>

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
                    <FormLabel>Price ($)</FormLabel>
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
                Create Listing
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    