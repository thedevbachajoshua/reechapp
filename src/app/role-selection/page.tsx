'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type Role = 'Supervisor' | 'Reacher';

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleRoleSelection = async () => {
    if (!selectedRole || !auth.currentUser || !firestore) return;
    
    setIsSubmitting(true);

    const userProfile = {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      name: auth.currentUser.displayName || 'New User',
      photoURL: auth.currentUser.photoURL || `https://picsum.photos/seed/${auth.currentUser.uid}/400/400`,
      role: selectedRole,
    };
    
    try {
      const userDocRef = doc(firestore, 'users', auth.currentUser.uid);
      await setDoc(userDocRef, userProfile, { merge: true });
      
      toast({
        title: 'Role Selected',
        description: `You are now a ${selectedRole}.`,
      });

      router.push('/dashboard');
    } catch (error) {
      console.error('Error setting user role:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not set your role. Please try again.',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Choose Your Role</CardTitle>
          <CardDescription>Select how you will be using the REACH: Nurture platform.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-2">
          <button
            onClick={() => setSelectedRole('Supervisor')}
            className={cn(
              'flex flex-col items-center justify-center gap-4 rounded-lg border p-6 text-center transition-all',
              selectedRole === 'Supervisor' ? 'border-primary ring-2 ring-primary' : 'hover:bg-accent'
            )}
          >
            <Shield className="h-12 w-12 text-primary" />
            <h3 className="text-lg font-semibold">Supervisor</h3>
            <p className="text-sm text-muted-foreground">Manage outreaches, teams, and view overall progress.</p>
          </button>
          <button
            onClick={() => setSelectedRole('Reacher')}
            className={cn(
              'flex flex-col items-center justify-center gap-4 rounded-lg border p-6 text-center transition-all',
              selectedRole === 'Reacher' ? 'border-primary ring-2 ring-primary' : 'hover:bg-accent'
            )}
          >
            <User className="h-12 w-12 text-primary" />
            <h3 className="text-lg font-semibold">Reacher</h3>
            <p className="text-sm text-muted-foreground">Connect with new believers and track your assigned follow-ups.</p>
          </button>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            disabled={!selectedRole || isSubmitting}
            onClick={handleRoleSelection}
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Continue as a {selectedRole || '...'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
