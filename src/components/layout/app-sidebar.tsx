

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
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M15.5 14.5c0-2.8-2.2-5-5-5s-5 2.2-5 5c0 1.5 1.5 3.5 5 5.5 3.5-2 5-4 5-5.5zm-5 2c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"
        fill="currentColor"
        opacity="0.3"
      />
      <path
        d="M12 11.5c.69 0 1.25.56 1.25 1.25v.25h-2.5v-.25c0-.69.56-1.25 1.25-1.25z"
        fill="currentColor"
      />
      <path
        d="M12 8c-1.1 0-2 .9-2 2v1h4v-1c0-1.1-.9-2-2-2zm0 6c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm-6.5-1c.18-1.59 1.5-2.83 3.09-2.96-.3.28-.59.61-.84.98C6.56 12.3 5.7 13.08 5.5 14z"
        fill="currentColor"
      />
      <path
        d="M15.25 12.02c-.25-.37-.54-.7-.84-.98C15.99 11.17 17.31 12.41 17.5 14c-1.5-.92-2.58-2.08-3.25-3.98z"
        fill="currentColor"
      />
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
