

'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import {
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
import { useUserContext } from '@/context/user-context';

const allMenuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Supervisor', 'Reacher'] },
  { href: '/dashboard/outreaches', label: 'Outreaches', icon: Flame, roles: ['Supervisor', 'Reacher'] },
  { href: '/dashboard/contacts', label: 'Contacts', icon: Users, roles: ['Supervisor', 'Reacher'] },
  { href: '/dashboard/follow-ups', label: 'Follow-ups', icon: MessageSquare, roles: ['Supervisor', 'Reacher'] },
  { href: '/dashboard/feed', label: 'Discipleship Feed', icon: BookOpen, roles: ['Supervisor', 'Reacher'] },
  { href: '/dashboard/ai-encouragement', label: 'AI Encouragement', icon: Sparkles, roles: ['Supervisor'] },
];

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


export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { userProfile, setUserProfile } = useUserContext();

  const handleLogout = () => {
    setUserProfile(null);
    router.push('/role-selection');
    handleLinkClick();
  };

  const handleLinkClick = () => {
    setOpenMobile(false);
  };
  
  const menuItems = allMenuItems.filter(item => userProfile?.role && item.roles.includes(userProfile.role));


  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground p-1.5">
            <ReechLogo className="h-6 w-6" />
          </div>
          <span className="font-bold text-2xl font-headline">REECH</span>
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
                onClick={handleLinkClick}
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
            <SidebarMenuButton asChild tooltip="Settings" onClick={handleLinkClick}>
              <Link href="/dashboard/settings">
                <Settings />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <div className="flex items-center gap-3 p-2 mt-2 rounded-md bg-sidebar-accent/50">
          <Avatar>
            <AvatarImage src={userProfile?.photoURL || undefined} data-ai-hint="person face" />
            <AvatarFallback>{userProfile?.name?.charAt(0) ?? 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 overflow-hidden">
            <p className="truncate font-semibold text-sm">{userProfile?.name ?? 'User'}</p>
            <p className="truncate text-xs text-sidebar-foreground/70">
              {userProfile?.email ?? ''}
            </p>
          </div>
          <SidebarMenuButton 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7" 
            tooltip="Log Out"
            onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
          </SidebarMenuButton>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
