'use client';

import { useUserContext } from '@/context/user-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function SettingsPage() {
  const { user, userProfile, loading, forceRefresh } = useUserContext();
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveChanges = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !userProfile || !firestore) return;

    setIsSaving(true);
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const photoURL = formData.get('photoURL') as string;

    const updatedProfile = {
      name,
      photoURL,
    };
    
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, updatedProfile, { merge: true });

      // Force a refresh of the user context to show the new data
      await forceRefresh();

      toast({
        title: 'Profile Updated',
        description: 'Your profile has been successfully updated.',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update profile. Please try again.',
      });
    } finally {
        setIsSaving(false);
    }
  };


  if (loading) {
    return <div>Loading profile...</div>;
  }

  if (!user || !userProfile) {
    return <div>Could not load user profile.</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Profile Settings</h1>
      <Card>
        <form onSubmit={handleSaveChanges}>
          <CardHeader>
            <CardTitle>Your Profile</CardTitle>
            <CardDescription>
              Update your personal information. Your role is: <span className="font-bold text-primary">{userProfile.role}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userProfile.photoURL || ''} alt={userProfile.name} data-ai-hint="person face" />
                <AvatarFallback>{userProfile.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="photoURL">Profile Picture URL</Label>
                <Input id="photoURL" name="photoURL" type="url" defaultValue={userProfile.photoURL || ''} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={userProfile.name || ''} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={user.email || ''} disabled />
            </div>
            <Button type="submit" disabled={isSaving}>
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
