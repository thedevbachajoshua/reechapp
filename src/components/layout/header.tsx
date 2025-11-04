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
import { HeartHandshake } from 'lucide-react';

const pathToTitle: { [key: string]: string } = {
    '/dashboard': 'Dashboard',
    '/dashboard/outreaches': 'Outreaches',
    '/dashboard/contacts': 'Contacts',
    '/dashboard/follow-ups': 'Follow-ups',
    '/dashboard/feed': 'Discipleship Feed',
    '/dashboard/ai-encouragement': 'AI Encouragement',
};

function BreadcrumbGenerator({ pathname, pageTitle }: { pathname: string, pageTitle?: string }) {
    const segments = pathname.split('/').filter(Boolean);

    if (segments.length < 2) {
        return (
            <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbPage>{pathToTitle[pathname] || 'Dashboard'}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        );
    }
    
    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                {segments.map((segment, index) => {
                    if (index === 0 && segment === 'dashboard') return null;

                    const href = `/${segments.slice(0, index + 1).join('/')}`;
                    const name = pageTitle && index === segments.length - 1
                        ? pageTitle
                        : pathToTitle[href] || segment.charAt(0).toUpperCase() + segment.slice(1);
                    const isLast = index === segments.length - 1;

                    return (
                        <React.Fragment key={href}>
                             {index > (segments[0] === 'dashboard' ? 1 : 0) && <BreadcrumbSeparator />}
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage>{name}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={href}>{name}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    )
}


export default function Header({ pageTitle }: { pageTitle?: string}) {
    const pathname = usePathname();

    // Do not render the header on layout, only on pages that pass pageTitle
    if (pageTitle === undefined && pathname.includes('dashboard/outreaches/')) {
        return null;
    }
    
    const isLayoutHeader = !pageTitle && !pathname.includes('dashboard/outreaches/');


    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                 <div className="md:hidden flex items-center gap-2 font-bold font-headline">
                    <HeartHandshake className="h-6 w-6 text-primary" />
                    REECH
                </div>
                <BreadcrumbGenerator pathname={pathname} pageTitle={pageTitle} />
            </div>
            {/* Future header items like search or user menu can go here */}
        </header>
    );
}
