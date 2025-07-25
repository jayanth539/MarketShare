'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

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
            // Update Firebase Auth profile
            await updateProfile(user, { displayName: name });
            
            // Update Firestore user document
            const userRef = doc(db, 'users', user.uid);
            await updateDoc(userRef, { name });

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
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-headline font-bold">Your Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your personal information and settings.</p>
        </div>
        
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

            <Button size="lg" className="w-full" onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
