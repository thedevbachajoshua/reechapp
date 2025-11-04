'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { UserProfile } from '@/lib/data';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface UserContextType {
  user: ReturnType<typeof useUser>['user'];
  userProfile: UserProfile | null;
  loading: boolean;
  forceRefresh: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user, isUserLoading: isAuthLoading } = useUser();
  const firestore = useFirestore();
  const router = useRouter();
  const pathname = usePathname();

  const userDocRef = useMemoFirebase(() => (user && firestore ? doc(firestore, 'users', user.uid) : null), [user, firestore]);
  const { data: userProfile, isLoading: isProfileLoading, setData: setUserProfile } = useDoc<UserProfile>(userDocRef);

  const [globalLoading, setGlobalLoading] = useState(true);

  const forceRefresh = useCallback(async () => {
    if (userDocRef) {
        const freshDoc = await getDoc(userDocRef);
        if (freshDoc.exists()) {
            setUserProfile({ ...freshDoc.data() as UserProfile, id: freshDoc.id });
        }
    }
  }, [userDocRef, setUserProfile]);

  useEffect(() => {
    const isAuthPage = ['/login', '/role-selection'].includes(pathname);

    // Stay on the current page if we're still determining auth state
    if (isAuthLoading) {
      setGlobalLoading(true);
      return;
    }

    // If no user and not on a public auth page, redirect to login
    if (!user && !isAuthPage) {
      router.push('/login');
      return;
    }
    
    // If there is a user but we are still waiting for their profile
    if (user && isProfileLoading) {
        setGlobalLoading(true);
        return;
    }

    // If user exists but has no role, and is not on role selection, redirect there
    if (user && !userProfile && pathname !== '/role-selection') {
      router.push('/role-selection');
      return;
    }

    // If user has a profile and is on an auth page, redirect to dashboard
    if (user && userProfile && isAuthPage) {
      router.push('/dashboard');
      return;
    }

    // If none of the above, loading is complete
    setGlobalLoading(false);

  }, [user, userProfile, isAuthLoading, isProfileLoading, pathname, router]);

  if (globalLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, userProfile, loading: globalLoading, forceRefresh }}>
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
