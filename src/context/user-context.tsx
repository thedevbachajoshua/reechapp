'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserProfile } from '@/lib/data';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

interface UserContextType {
  userProfile: UserProfile | null;
  loading: boolean;
  setUserProfile: (profile: UserProfile | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // This is a simplified auth check for a client-side prototype.
    // In a real app, you'd check a token or session.
    const isAuthPage = ['/role-selection'].includes(pathname);

    if (!userProfile && !isAuthPage) {
      // If there's no user and we're not on the role selection page, go there.
      router.push('/role-selection');
    } else if (userProfile && isAuthPage) {
      // If there IS a user and we're on the role selection page, go to the dashboard.
      router.push('/dashboard');
    } else {
      // In all other cases (user on an app page, or no user on the role page), loading is done.
      setLoading(false);
    }
  }, [userProfile, pathname, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ userProfile, loading, setUserProfile }}>
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
