
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
import Image from 'next/image';
import HeartHandshake from '../icons/HeartHandshake';

const pathToTitle: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/dashboard/outreaches': 'Outreaches',
    '/dashboard/contacts': 'Contacts',
    '/dashboard/follow-ups': 'Follow-ups',
    '/dashboard/feed': 'Discipleship Feed',
    '/dashboard/ai-encouragement': 'AI Encouragement',
    '/dashboard/settings': 'Settings',
};


function BreadcrumbGenerator({ pathname, pageTitle }: { pathname: string, pageTitle?: string }) {
    const segments = pathname.split('/').filter(Boolean);
    
    // If we're on the main dashboard page
    if (pathname === '/dashboard') {
        return (
            <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>Dashboard</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
    }
    
    const breadcrumbItems: React.ReactNode[] = [];
    let currentPath = '';

    for (let i = 0; i < segments.length; i++) {
        currentPath += `/${segments[i]}`;
        const isLast = i === segments.length - 1;
        const title = isLast && pageTitle ? pageTitle : pathToTitle[currentPath];

        if (title && i > 0) { // Start from the first segment after 'dashboard'
             if(breadcrumbItems.length > 0) {
                breadcrumbItems.push(<BreadcrumbSeparator key={`sep-${i}`} />);
             }
             breadcrumbItems.push(
                <BreadcrumbItem key={currentPath}>
                    {isLast ? (
                        <BreadcrumbPage>{title}</BreadcrumbPage>
                    ) : (
                        <BreadcrumbLink asChild>
                            <Link href={currentPath}>{title}</Link>
                        </BreadcrumbLink>
                    )}
                </BreadcrumbItem>
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
                        <HeartHandshake className="w-12 h-12" />
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
                        <HeartHandshake className="w-12 h-12" />
                        REECH
                    </div>
                    <BreadcrumbGenerator pathname={pathname} pageTitle={pageTitle} />
                </div>
            </header>
        )
     }

    return null;
}
