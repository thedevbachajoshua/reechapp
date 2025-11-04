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

  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    // Don't do anything until both auth and profile loading are complete
    if (isAuthLoading || (user && isProfileLoading)) {
      return;
    }

    const isAuthPage = pathname === '/login' || pathname === '/role-selection';

    // If user is not logged in and not on an auth page, redirect to login.
    if (!user && !isAuthPage) {
      router.push('/login');
      return;
    }

    // If user is logged in but has no profile/role, redirect to role selection,
    // but only if we are not already on an auth page.
    if (user && !userProfile && !isAuthPage) {
        router.push('/role-selection');
        return;
    }

    // If user is logged in and on an auth page, send to dashboard.
    if (user && userProfile && isAuthPage) {
      router.push('/dashboard');
      return;
    }

    // If we've reached this point, no redirect is needed.
    setIsRedirecting(false);

  }, [user, isAuthLoading, userProfile, isProfileLoading, router, pathname]);

  const loading = isAuthLoading || isProfileLoading || isRedirecting;
  const isAuthPage = pathname === '/login' || pathname === '/role-selection';

  // Show a global loader if we're loading and not on an auth page
  if (loading && !isAuthPage) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // If we are on an auth page, render the children immediately
  // The useEffect will handle redirecting away if the user is already logged in.
  if (isAuthPage) {
    return (
        <UserContext.Provider value={{ user, userProfile, loading }}>
            {children}
        </UserContext.Provider>
    );
  }


  return (
    <UserContext.Provider value={{ user, userProfile, loading }}>
      {!loading ? children : null}
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
