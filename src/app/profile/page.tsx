'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';
import { Loader2, Edit, Trash2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Product } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { format } from 'date-fns';
import Link from 'next/link';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

function MyListings() {
    const { user } = useAuth();
    const [listings, setListings] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        fetchListings();
    }, [user]);

    const fetchListings = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('seller->>id', user.uid)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            setListings(data as Product[]);
        } catch (error: any) {
            toast({ title: "Failed to fetch listings", description: error.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId: string, imageUrl: string | null) => {
        if (!user) return;
        
        const { error: dbError } = await supabase
            .from('products')
            .delete()
            .eq('id', productId);

        if (dbError) {
            toast({ title: 'Error deleting listing', description: dbError.message, variant: 'destructive' });
            return;
        }

        if (imageUrl) {
            const path = new URL(imageUrl).pathname.split('/public/listings/')[1];
             if (path) {
                const { error: storageError } = await supabase.storage
                    .from('listings')
                    .remove([path]);
                
                if (storageError) {
                    console.error('Error deleting image from storage:', storageError);
                }
            }
        }
        
        toast({ title: 'Listing deleted successfully!' });
        fetchListings();
    };

    if (loading) {
        return <div className="text-center p-8"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>;
    }

    if (listings.length === 0) {
        return <div className="text-center p-8 text-muted-foreground">You haven't listed any items yet.</div>
    }

    return (
        <div className="space-y-4">
            {listings.map(listing => (
                <Card key={listing.id}>
                    <CardContent className="flex items-center gap-4 p-4">
                        <Image src={listing.image_url!} alt={listing.title} width={100} height={100} className="rounded-md object-cover" />
                        <div className="flex-grow">
                            <h3 className="font-semibold text-lg">{listing.title}</h3>
                            <p className="text-primary font-bold">${listing.price.toLocaleString()}</p>
                            <p className="text-sm text-muted-foreground">
                                Listed on {format(new Date(listing.created_at), 'PPP')}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                             <Button asChild variant="outline" size="sm">
                                <Link href={`/listings/${listing.id}/edit`}><Edit className="mr-2 h-4 w-4"/> Edit</Link>
                            </Button>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4"/> Delete</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will permanently delete your listing.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleDelete(listing.id, listing.image_url)}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}


export default function ProfilePage() {
    const { user, loading } = useAuth();
    const [name, setName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (user) {
            setName(user.displayName || '');
        }
    }, [user]);

    const handleSaveChanges = async () => {
        if (!user) return;
        setIsSaving(true);
        try {
            await updateProfile(user, { displayName: name });
            
            toast({ title: "Profile updated successfully!" });
        } catch (error) {
            console.error("Error updating profile: ", error);
            toast({ title: "Failed to update profile", variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };
    
    if (loading) {
        return <div className="container mx-auto px-4 py-12 text-center">Loading...</div>
    }

    if (!user) {
        return <div className="container mx-auto px-4 py-12 text-center">Please log in to view your profile.</div>
    }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-headline font-bold">Your Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information, settings, and listings.</p>
        </div>
        
        <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile Details</TabsTrigger>
                <TabsTrigger value="listings">My Listings</TabsTrigger>
            </TabsList>
            <TabsContent value="profile">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Profile Details</CardTitle>
                        <CardDescription>Update your name and see your account email.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.photoURL || undefined} alt={user.displayName || 'User'} />
                            <AvatarFallback>{(user.displayName || 'U').charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Button variant="outline" disabled>Change Photo (coming soon)</Button>
                        </div>
                        
                        <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                        </div>

                        <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={user.email || ''} disabled />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button size="lg" onClick={handleSaveChanges} disabled={isSaving}>
                            {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </CardFooter>
                </Card>
            </TabsContent>
            <TabsContent value="listings">
                <MyListings />
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
