

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
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 6.4C10.7 4.5 8.2 4 6.5 5.3C4.8 6.6 4.8 9.3 6.5 11.2L12 17.4L17.5 11.2C19.2 9.3 19.2 6.6 17.5 5.3C15.8 4 13.3 4.5 12 6.4Z"
        fill="currentColor"
      />
      <path
        d="M18.8 15C18.2 15 17.6 15.3 17.1 15.8C16.6 16.3 16.1 16.9 15.4 17.2C14.7 17.5 13.9 17.6 13.1 17.6C11.6 17.6 10.3 17.1 9.2 16.2C8.1 15.3 7.2 14 6.8 12.6C6.4 11.2 6.5 9.7 7.2 8.4C7.9 7.1 9 6.2 10.3 5.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
                    <div className="md:hidden flex items-center gap-2 font-bold font-headline text-2xl">
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
                     <div className="md:hidden flex items-center gap-2 font-bold font-headline text-2xl">
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
