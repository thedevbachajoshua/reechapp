import type { ReactNode } from 'react';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  // Check if children have a specific page component that will render its own header
  const child: any = React.Children.only(children);
  const isDetailPage = child.props.childProp?.segment === '[outreachId]';

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {!isDetailPage && <Header />}
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
