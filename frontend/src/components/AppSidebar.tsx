import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import {
  Sidebar, SidebarContent,
  SidebarFooter,
  SidebarGroup, SidebarGroupContent,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { VAS_ICONS } from '@/config/icons';
import { cn } from '@/lib/utils';
import { Role } from '@/services/users';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router';

interface AppSidebarProps {
  side?: 'left' | 'right';
}

export function AppSidebar({ side = 'left' }: AppSidebarProps) {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuthStore();
  const { theme, setTheme } = useThemeStore();
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();
  const role = user?.role;
  const isRtl = i18n.language === 'ar';

  const mainItems = [
    { title: t('nav.dashboard'), url: role === Role.ADMIN ? '/admin/dashboard' : role === Role.OPERATOR ? '/operator/dashboard' : '/manager/monitor', icon: VAS_ICONS.dashboard, roles: [Role.ADMIN, Role.OPERATOR, Role.MANAGER] },
    { title: t('nav.vips'), url: '/vips', icon: VAS_ICONS.vips, roles: [Role.ADMIN, Role.OPERATOR] },
    { title: t('nav.events'), url: '/events', icon: Calendar, roles: [Role.ADMIN] },
    { title: t('nav.cameras'), url: '/cameras', icon: VAS_ICONS.cameras, roles: [Role.ADMIN, Role.OPERATOR] },
    { title: t('nav.users'), url: '/users', icon: VAS_ICONS.users, roles: [Role.ADMIN] },
    { title: t('nav.accountDevices'), url: '/account-devices', icon: VAS_ICONS.device, roles: [Role.ADMIN] },
    { title: t('nav.monitor'), url: '/manager/monitor', icon: VAS_ICONS.monitor, roles: [Role.MANAGER] },
    { title: t('settings.title'), url: '/settings', icon: VAS_ICONS.settings, roles: [Role.ADMIN, Role.OPERATOR, Role.MANAGER, Role.GATE_GUARD] },
  ].filter((item) => role && item.roles.includes(role));


  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sidebar collapsible="icon" side={side}>
      <SidebarContent>
        {/* Logo Section */}
        {!collapsed ? (
          <div className="p-4 md:p-6 flex items-center justify-center border-b border-[#1e293b]/50">
            <div className="flex items-center gap-4" dir="ltr">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-[0_0_30px_rgba(147,51,234,0.4)] shrink-0">V</div>
              <div className="text-left items-start flex flex-col">
                <span className="text-xl font-black text-white tracking-tighter leading-none block">VAS COMMAND</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 block">PLATFORM_v2.5</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-2 flex items-center justify-center border-b border-[#1e293b]/50">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-black text-sm shadow-[0_0_20px_rgba(147,51,234,0.4)]">V</div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild >
                    <NavLink
                      to={item.url}
                      className={cn(
                        'hover:bg-primary/20 hover:text-primary transition-color',
                        location.pathname === item.url && 'bg-primary text-white shadow-2xl shadow-primary/20'
                      )}
                      activeClassName="bg-primary text-white shadow-2xl shadow-primary/20"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                      {!collapsed && location.pathname === item.url &&
                        <div className={`absolute ${isRtl ? '-right-1' : '-left-1'} w-1 h-6 bg-white rounded-full`}></div>
                      }
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-2 space-y-1">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/20 hover:text-primary" onClick={toggleTheme}>
            {
              theme === 'dark' ? <VAS_ICONS.moon className="h-4 w-4" /> :
                theme === 'light' ? <VAS_ICONS.sun className="h-4 w-4" /> :
                  <VAS_ICONS.monitor className="h-4 w-4" />
            }
          </Button>
        </div>
        {!collapsed && user && (
          <div className="px-2 py-1">
            <p className="text-xs font-medium text-sidebar-foreground truncate">{user.name}</p>
            <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
          </div>
        )}
        <Button variant="ghost" size={collapsed ? 'icon' : 'sm'} className="w-full justify-start gap-2 text-muted-foreground text-rose-500 hover:bg-rose-500/10" onClick={handleLogout}>
          <VAS_ICONS.logout className="h-4 w-4" />
          {!collapsed && t('common.logout')}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
