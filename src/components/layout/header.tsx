

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
        <path d="M11.9999 3.75C11.1499 5.03 9.4499 5.34 8.1399 4.62C6.8299 3.9 6.2799 2.27 6.9499 0.96C4.0999 2.12 1.9999 4.93 1.9999 8.25C1.9999 12.82 5.8299 16.65 10.3999 16.65H10.4699L11.9999 18.25L13.5299 16.65H13.5999C18.1699 16.65 21.9999 12.82 21.9999 8.25C21.9999 4.93 19.8999 2.12 17.0499 0.96C17.7199 2.27 17.1699 3.9 15.8599 4.62C14.5499 5.34 12.8499 5.03 11.9999 3.75Z" fill="#FFD700"/>
        <path d="M12.5 8.5C12.5 8.5 14.5 9.5 15.5 11.5C16.5 13.5 16 15 16 15L15 14C15 14 14.5 12.5 13.5 11.5C12.5 10.5 11 10 11 10C11 10 10.5 8.5 11.5 8C12.5 7.5 12.5 8.5 12.5 8.5Z" fill="currentColor"/>
        <path d="M10.5 10.5L8.5 12C8.5 12 7.5 13 8 14.5C8.5 16 10 16 10 16L11 15C11 15 9.5 15 9 14C8.5 13 9 12 9 12L10.5 10.5Z" fill="currentColor"/>
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
