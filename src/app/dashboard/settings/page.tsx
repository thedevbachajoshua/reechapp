'use client';

import { useUserContext } from '@/context/user-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { Loader2, Shield, User, HelpCircle, FileText, Info, Camera } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import type { UserProfile } from '@/lib/data';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UpdateProfilePicture } from '@/components/settings/update-profile-picture';


const profileFormSchema = {
  name: (value: string) => value.length > 0 ? null : "Name is required",
  photoURL: (value: string) => (value.startsWith('http://') || value.startsWith('https://') || value === '') ? null : "Must be a valid URL",
  phone: (value: string) => value.length > 0 ? null : "Phone is required",
  organization: (value: string) => null, // Optional
};


export default function SettingsPage() {
  const { user, userProfile, loading, forceRefresh } = useUserContext();
  const { toast } = useToast();
  const firestore = useFirestore();
  const [isSaving, setIsSaving] = useState(false);
  const [isPictureDialogOpen, setIsPictureDialogOpen] = useState(false);
  
  const handleSaveChanges = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !userProfile || !firestore) return;

    setIsSaving(true);
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const photoURL = formData.get('photoURL') as string;
    const phone = formData.get('phone') as string;
    const organization = formData.get('organization') as string;

    const updatedProfile = {
      name,
      photoURL,
      phone,
      organization,
    };
    
    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      await setDoc(userDocRef, updatedProfile, { merge: true });

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

  const handleRoleChange = async (newRole: UserProfile['role']) => {
    if (!user || !userProfile || !firestore || userProfile.role === newRole) return;
    
    try {
        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(userDocRef, { role: newRole }, { merge: true });
        await forceRefresh();
        toast({
            title: "Role Updated",
            description: `Your role has been changed to ${newRole}.`
        });
    } catch (error) {
         console.error('Error updating role:', error);
         toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Failed to update your role. Please try again.',
         });
    }
  };

  const handleProfilePictureUpdate = async (newPhotoUrl: string) => {
    if (!user || !firestore) return;

    try {
        const userDocRef = doc(firestore, 'users', user.uid);
        await setDoc(userDocRef, { photoURL: newPhotoUrl }, { merge: true });
        await forceRefresh();
        toast({
            title: 'Profile Picture Updated',
            description: 'Your new profile picture has been saved.',
        });
    } catch (error) {
        console.error('Error updating profile picture:', error);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not update your profile picture.',
        });
    } finally {
        setIsPictureDialogOpen(false);
    }
  };


  if (loading || !userProfile || !user) {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Settings</h1>
            <div className="w-full h-64 rounded-lg bg-muted animate-pulse" />
        </div>
    );
  }

  const otherRole: UserProfile['role'] = userProfile.role === 'Supervisor' ? 'Reacher' : 'Supervisor';

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Settings</h1>
      
      <Tabs defaultValue="account" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="more">More</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
            <Card>
                <form onSubmit={handleSaveChanges}>
                <CardHeader>
                    <CardTitle>Your Profile</CardTitle>
                    <CardDescription>
                    Update your personal information.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col items-center gap-2">
                        <Avatar className="h-24 w-24">
                          <AvatarImage src={userProfile.photoURL || undefined} alt={userProfile.name} data-ai-hint="person face" />
                          <AvatarFallback>{userProfile.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <Dialog open={isPictureDialogOpen} onOpenChange={setIsPictureDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                    <Camera className="mr-2 h-4 w-4" />
                                    Change Picture
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Update Profile Picture</DialogTitle>
                                    <DialogDescription>
                                        Take a new photo or upload one from your gallery.
                                    </DialogDescription>
                                </DialogHeader>
                                <UpdateProfilePicture 
                                  onPictureSelected={handleProfilePictureUpdate}
                                  currentPicture={userProfile.photoURL}
                                />
                            </DialogContent>
                        </Dialog>
                      </div>
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                          <Label htmlFor="photoURL">Profile Picture URL</Label>
                          <Input id="photoURL" name="photoURL" type="url" defaultValue={userProfile.photoURL || ''} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" defaultValue={userProfile.name || ''} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" defaultValue={user.email || ''} disabled />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" name="phone" defaultValue={(userProfile as any).phone || ''} />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="organization">Church/Organization (Optional)</Label>
                            <Input id="organization" name="organization" defaultValue={(userProfile as any).organization || ''} />
                        </div>
                    </div>
                    <Button type="submit" disabled={isSaving}>
                    {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Changes
                    </Button>
                </CardContent>
                </form>
            </Card>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Your Role</CardTitle>
                    <CardDescription>Your current role determines your permissions within the app.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                        {userProfile.role === 'Supervisor' 
                            ? <Shield className="h-8 w-8 text-primary" /> 
                            : <User className="h-8 w-8 text-primary" />}
                        <div>
                             <p className="font-semibold">You are a</p>
                             <Badge className="text-base mt-1">{userProfile.role}</Badge>
                        </div>
                    </div>

                     <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="outline">Switch to {otherRole}</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to switch your role?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Changing your role to <span className="font-bold">{otherRole}</span> will alter your permissions and what you can see and do in the app. This action can be undone at any time from the settings page.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleRoleChange(otherRole)}>
                                Yes, Switch to {otherRole}
                            </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="more">
            <Card>
                <CardHeader>
                    <CardTitle>Resources & Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                     <Button variant="ghost" className="w-full justify-start"><HelpCircle className="mr-2"/>Help Center</Button>
                     <Button variant="ghost" className="w-full justify-start"><FileText className="mr-2"/>Terms of Service</Button>
                     <Button variant="ghost" className="w-full justify-start"><FileText className="mr-2"/>Privacy Policy</Button>
                     <Button variant="ghost" className="w-full justify-start"><Info className="mr-2"/>About REACH</Button>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
