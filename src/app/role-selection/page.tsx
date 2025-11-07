'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, User, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUserContext } from '@/context/user-context';

type Role = 'Supervisor' | 'Reacher';

export default function RoleSelectionPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { setUserProfile } = useUserContext();

  const handleRoleSelection = () => {
    if (!selectedRole) return;
    
    setIsSubmitting(true);

    const simulatedUserProfile = {
      uid: selectedRole === 'Supervisor' ? 'supervisor-001' : 'reacher-001',
      email: selectedRole === 'Supervisor' ? 'supervisor@example.com' : 'reacher@example.com',
      name: selectedRole === 'Supervisor' ? 'Supervisor Sam' : 'Reacher Rachel',
      photoURL: `https://picsum.photos/seed/${selectedRole}/400/400`,
      role: selectedRole,
    };
    
    // Simulate a network request
    setTimeout(() => {
      setUserProfile(simulatedUserProfile);
      
      toast({
        title: 'Role Selected',
        description: `You are now viewing as a ${selectedRole}. Redirecting to dashboard...`,
      });

      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Choose Your Role</CardTitle>
          <CardDescription>Select how you will be using the REECH platform for this demo.</CardDescription>
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
