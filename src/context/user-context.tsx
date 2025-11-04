'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { UserProfile } from '@/lib/data';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface UserContextType {
  user: ReturnType<typeof useUser>['user'];
  userProfile: UserProfile | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const userDocRef = useMemoFirebase(() => (user && firestore ? doc(firestore, 'users', user.uid) : null), [user, firestore]);
  const { data: userProfile, isLoading: isProfileLoading } = useDoc<UserProfile>(userDocRef);

  const [globalLoading, setGlobalLoading] = useState(true);

  useEffect(() => {
    // Determine if we are on a page that doesn't require authentication
    const isPublicPage = ['/login', '/role-selection'].includes(pathname);

    // If auth state is still loading, we wait.
    if (isAuthLoading) {
      setGlobalLoading(true);
      return;
    }

    // If no user is logged in, and we are not on a public page, redirect to login.
    if (!user && !isPublicPage) {
      router.push('/login');
      // We don't set loading to false yet, the redirect will cause a re-render.
      return;
    }
    
    // If a user is logged in, but we are still loading their profile, wait.
    if (user && isProfileLoading) {
      setGlobalLoading(true);
      return;
    }

    // If a user is logged in but has no profile, redirect to role selection,
    // unless they are already on a public page.
    if (user && !userProfile && !isPublicPage) {
      router.push('/role-selection');
      return;
    }

    // If a user is logged in, has a profile, and is on a public page,
    // redirect them to the dashboard.
    if (user && userProfile && isPublicPage) {
      router.push('/dashboard');
      return;
    }

    // If none of the above conditions are met, we are done loading and can show the content.
    setGlobalLoading(false);

  }, [user, userProfile, isAuthLoading, isProfileLoading, pathname, router]);

  // If we are in a loading state, show the global loader.
  if (globalLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // Once loading is complete, provide the context and render the children.
  return (
    <UserContext.Provider value={{ user, userProfile, loading: globalLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};
