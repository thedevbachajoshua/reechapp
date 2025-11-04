'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  HeartHandshake,
  LayoutDashboard,
  Users,
  MessageSquare,
  BookOpen,
  Sparkles,
  LogOut,
  Settings,
  Flame,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/outreaches', label: 'Outreaches', icon: Flame },
  { href: '/dashboard/contacts', label: 'Contacts', icon: Users },
  { href: '/dashboard/follow-ups', label: 'Follow-ups', icon: MessageSquare },
  { href: '/dashboard/feed', label: 'Discipleship Feed', icon: BookOpen },
  { href: '/dashboard/ai-encouragement', label: 'AI Encouragement', icon: Sparkles },
];

export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <HeartHandshake className="h-6 w-6" />
          </div>
          <span className="font-bold text-lg font-headline">REACH: Nurture</span>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex-1 p-2">
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname.startsWith(item.href) && (item.href === '/dashboard' ? pathname === item.href : true)}
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild tooltip="Settings">
              <Link href="#">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-3 p-2 mt-2 rounded-md bg-sidebar-accent/50">
          <Avatar>
            <AvatarImage src="https://picsum.photos/seed/coordinator/40/40" data-ai-hint="person face" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-semibold text-sm">John Doe</p>
            <p className="truncate text-xs text-sidebar-foreground/70">
              john.doe@reach.org
            </p>
          </div>
          <SidebarMenuButton 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7" 
            tooltip="Log Out"
            onClick={() => router.push('/login')}>
              <LogOut className="h-4 w-4" />
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
