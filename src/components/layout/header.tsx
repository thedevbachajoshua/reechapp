'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { usePathname } from 'next/navigation';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React from 'react';
import Link from 'next/link';

const pathToTitle: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/dashboard/outreaches': 'Outreaches',
    '/dashboard/contacts': 'Contacts',
    '/dashboard/follow-ups': 'Follow-ups',
    '/dashboard/feed': 'Discipleship Feed',
    '/dashboard/ai-encouragement': 'AI Encouragement',
    '/dashboard/settings': 'Settings',
};

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
      <path d="M4 14.899A7 7 0 1 1 15 8.5V11a.5.5 0 0 1-1_0V8.29a5 5 0 0 0-10 2.29"/>
      <path d="M4 21.5V17a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v4.5"/>
      <path d="M12 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z"/>
      <path d="M16 11.5a2.5 2.5 0 0 1 3.54 0L22 14"/>
    </svg>
);


function BreadcrumbGenerator({ pathname, pageTitle }: { pathname: string, pageTitle?: string }) {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbItems: React.ReactNode[] = [];
    
    // Always add Dashboard if it's a dashboard page
    if (segments[0] === 'dashboard') {
        const isLast = segments.length === 1;
        breadcrumbItems.push(
            <BreadcrumbItem key="dashboard">
                {isLast ? (
                     <BreadcrumbPage>Dashboard</BreadcrumbPage>
                ) : (
                    <BreadcrumbLink asChild>
                        <Link href="/dashboard">Dashboard</Link>
                    </BreadcrumbLink>
                )}
            </BreadcrumbItem>
        );
    }
    
    // Handle nested pages
    if (segments.length > 1) {
        let currentPath = `/${segments[0]}`;
        for (let i = 1; i < segments.length; i++) {
            currentPath += `/${segments[i]}`;
            const isLast = i === segments.length - 1;
            
            // Use pageTitle for the very last segment if it exists
            const name = isLast && pageTitle 
                ? pageTitle 
                : (pathToTitle[currentPath] || segments[i].charAt(0).toUpperCase() + segments[i].slice(1));

            // Don't create a link for UUIDs, use the provided title instead
            const isDynamicRoute = !pathToTitle[currentPath] && i === segments.length - 1;

            breadcrumbItems.push(
                <React.Fragment key={currentPath}>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        {isLast ? (
                           <BreadcrumbPage>{name}</BreadcrumbPage>
                        ) : (
                            <BreadcrumbLink asChild>
                                <Link href={currentPath}>{name}</Link>
                            </BreadcrumbLink>
                        )}
                    </BreadcrumbItem>
                </React.Fragment>
            );
        }
    }


    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                {breadcrumbItems}
            </BreadcrumbList>
        </Breadcrumb>
    )
}


export default function Header({ pageTitle }: { pageTitle?: string}) {
    const pathname = usePathname();

    const isLayoutHeader = !pageTitle && !pathname.startsWith('/dashboard/outreaches/');
    const isDetailPage = !!pageTitle && pathname.startsWith('/dashboard/outreaches/');

    if (isLayoutHeader) {
         return (
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="md:hidden" />
                    <div className="md:hidden flex items-center gap-2 font-bold font-headline">
                        <ReechLogo className="h-6 w-6 text-primary" />
                        REECH
                    </div>
                    <BreadcrumbGenerator pathname={pathname} />
                </div>
            </header>
        );
    }

     if (isDetailPage) {
        return (
            <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
                 <div className="flex items-center gap-2">
                    <SidebarTrigger className="md:hidden" />
                     <div className="md:hidden flex items-center gap-2 font-bold font-headline">
                        <ReechLogo className="h-6 w-6 text-primary" />
                        REECH
                    </div>
                    <BreadcrumbGenerator pathname={pathname} pageTitle={pageTitle} />
                </div>
            </header>
        )
     }

    return null;
}
