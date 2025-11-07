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
import { useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

const allMenuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['Supervisor', 'Reacher'] },
  { href: '/dashboard/outreaches', label: 'Outreaches', icon: Flame, roles: ['Supervisor', 'Reacher'] },
  { href: '/dashboard/contacts', label: 'Contacts', icon: Users, roles: ['Supervisor', 'Reacher'] },
  { href: '/dashboard/follow-ups', label: 'Follow-ups', icon: MessageSquare, roles: ['Supervisor'] },
  { href: '/dashboard/feed', label: 'Discipleship Feed', icon: BookOpen, roles: ['Supervisor', 'Reacher'] },
  { href: '/dashboard/ai-encouragement', label: 'AI Encouragement', icon: Sparkles, roles: ['Supervisor'] },
];

const ReechLogo = (props: React.SVGProps<SVGSVGElement>) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <path d="M4 14.899A7 7 0 1 1 15 8.5V11a.5.5 0 0 1-1 0V8.29a5 5 0 0 0-10 2.29"/>
      <path d="M4 21.5V17a3 3 0 0 1 3-3h5a3 3 0 0 1 3 3v4.5"/>
      <path d="M12 12a2-2 0 1 0 4 0 2 2 0 0 0-4 0Z"/>
      <path d="M16 11.5a2.5 2.5 0 0 1 3.54 0L22 14"/>
    </svg>
);


export default function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { setOpenMobile } = useSidebar();
  const { user, userProfile } = useUserContext();
  const auth = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
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
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
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
              {user?.email ?? ''}
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
