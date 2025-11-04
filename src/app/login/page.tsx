import { LoginForm } from '@/components/auth/login-form';
import { HeartHandshake } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <HeartHandshake className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-foreground font-headline">REACH: Nurture</h1>
          <p className="text-muted-foreground">Sign in to nurture and grow your community</p>
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
