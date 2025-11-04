'use client';

import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, AuthError } from 'firebase/auth';

const formSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email.' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters.' }),
});

export function LoginForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // First, try to sign in the user.
      await signInWithEmailAndPassword(auth, values.email, values.password);
      // onAuthStateChanged in UserProvider will handle redirect on success.
    } catch (error) {
      const authError = error as AuthError;
      // If sign-in fails because the user doesn't exist, create a new account.
      // Firebase returns 'auth/invalid-credential' for both wrong password and user not found.
      if (authError.code === 'auth/user-not-found' || authError.code === 'auth/invalid-credential') {
        try {
          await createUserWithEmailAndPassword(auth, values.email, values.password);
          // New user created. onAuthStateChanged will redirect them to role selection.
          toast({
            title: 'Welcome!',
            description: 'Your account has been created. Please choose your role.',
          });
        } catch (signUpError) {
          const signUpAuthError = signUpError as AuthError;
          // Handle specific sign-up errors.
          let errorMessage = 'An unexpected error occurred during sign-up.';
           if (signUpAuthError.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already in use with a different password.';
          }
          toast({
            variant: 'destructive',
            title: 'Sign-Up Failed',
            description: errorMessage,
          });
        }
      } else {
        // Handle other sign-in errors (like wrong password).
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description: 'Invalid email or password. Please try again.',
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4 pt-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="name@example.com" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between">
                    <FormLabel>Password</FormLabel>
                    <a href="#" tabIndex={-1} className="text-sm text-accent-foreground/80 hover:underline">
                      Forgot password?
                    </a>
                  </div>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In or Create Account
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
