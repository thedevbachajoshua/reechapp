
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
    const isOutreachDetailPage = pathname.includes('/dashboard/outreaches/') && segments.length > 2;

    let title: string | undefined;

    if (isOutreachDetailPage) {
        title = pageTitle;
    } else {
        title = pathToTitle[pathname];
    }
    
    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                <BreadcrumbItem>
                    {isOutreachDetailPage ? (
                        <BreadcrumbLink asChild>
                            <Link href="/dashboard/outreaches">Outreaches</Link>
                        </BreadcrumbLink>
                    ) : (
                        <BreadcrumbPage>{title}</BreadcrumbPage>
                    )}
                </BreadcrumbItem>
                
                 {isOutreachDetailPage && title && (
                    <>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{title}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    )
}


export default function Header({ pageTitle }: { pageTitle?: string}) {
    const pathname = usePathname();

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
    );
}
