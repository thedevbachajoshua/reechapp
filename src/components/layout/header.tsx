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

function BreadcrumbGenerator({ pathname }: { pathname: string }) {
    const segments = pathname.split('/').filter(Boolean);

    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/dashboard">Dashboard</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {segments.length > 1 && segments.slice(1).map((segment, index) => {
                    const href = `/${segments.slice(0, index + 2).join('/')}`;
                    const isLast = index === segments.length - 2;
                    const name = pathToTitle[href] || segment.charAt(0).toUpperCase() + segment.slice(1);

                    return (
                        <React.Fragment key={href}>
                            <BreadcrumbSeparator />
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

export default function Header() {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur-sm md:px-6">
            <div className="flex items-center gap-2">
                <SidebarTrigger className="md:hidden" />
                 <div className="md:hidden flex items-center gap-2 font-bold font-headline">
                    <HeartHandshake className="h-6 w-6 text-primary" />
                    REACH: Nurture
                </div>
                <BreadcrumbGenerator pathname={pathname} />
            </div>
            {/* Future header items like search or user menu can go here */}
        </header>
    );
}
