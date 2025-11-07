

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
