'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ProfilePage() {
  // Mock user data
  const user = {
    name: 'Alex Doe',
    email: 'alex.doe@example.com',
    avatarUrl: 'https://placehold.co/100x100.png',
  };

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
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <Button variant="outline">Change Photo</Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={user.name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input id="email" type="email" value={user.email} disabled />
            </div>

            <Button size="lg" className="w-full">Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
