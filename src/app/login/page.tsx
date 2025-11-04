'use client';
import { LoginForm } from '@/components/auth/login-form';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const ReechLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M4 14.899A7 7 0 1 1 15 8.5V11a.5.5 0 0 1-1 0V8.29a5 5 0 0 0-10 2.29"/>
      <path d="M4 21.5V17a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v4.5"/>
      <path d="M12 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/>
      <path d="M16 11.5a2.5 2.5 0 0 1 3.54 0L22 14"/>
    </svg>
);


export default function LoginPage() {
    const { user, isUserLoading } = useUser();
    const router = useRouter();

    useEffect(() => {
        if (!isUserLoading && user) {
            router.push('/dashboard');
        }
    }, [user, isUserLoading, router]);

    if (isUserLoading || user) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center bg-background">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <ReechLogo className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground font-headline">REECH</h1>
          <p className="text-muted-foreground">Sign in as a Supervisor or Reacher to continue.</p>
        </div>
        <LoginForm />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <a href="#" className="font-semibold text-primary/90 hover:text-primary">
            Contact Admin
          </a>
        </p>
      </div>
    </div>
  );
}
