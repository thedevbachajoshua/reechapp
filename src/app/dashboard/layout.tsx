import React, { type ReactNode } from 'react';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { UserProvider } from '@/context/user-context';
import { FirebaseClientProvider } from '@/firebase';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Check if children have a specific page component that will render its own header
  const child: any = React.Children.only(children);
  const isDetailPage = child.props.childProp?.segment === '[outreachId]';

  return (
    <FirebaseClientProvider>
      <UserProvider>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            {!isDetailPage && <Header />}
            <main className="p-4 md:p-6 lg:p-8">
                {children}
            </main>
          </SidebarInset>
        </SidebarProvider>
      </UserProvider>
    </FirebaseClientProvider>
  );
}
