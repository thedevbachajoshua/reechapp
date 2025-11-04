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

  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Don't do anything until Firebase Auth has resolved.
    if (isAuthLoading) {
      return;
    }

    const isAuthPage = pathname === '/login' || pathname === '/role-selection';

    // If user is not logged in and not on an auth page, redirect to login.
    if (!user && !isAuthPage) {
      router.push('/login');
      return;
    }

    // Auth is resolved, user is logged in, but profile is still loading.
    if (user && isProfileLoading) {
        return;
    }

    // If user is logged in but has no profile/role, redirect to role selection.
    if (user && !userProfile && !isProfileLoading && pathname !== '/role-selection') {
        setIsRedirecting(true);
        router.push('/role-selection');
    } else if (user && userProfile) {
        setIsRedirecting(false);
    }
  }, [user, isAuthLoading, userProfile, isProfileLoading, router, pathname]);

  const loading = isAuthLoading || isProfileLoading || isRedirecting;
  const isAuthPage = pathname === '/login' || pathname === '/role-selection';

  // If we are on an auth page, we don't need to show the global loader
  // unless we are performing the initial user check.
  if (loading && !isAuthPage) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, userProfile, loading }}>
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
