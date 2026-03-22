import { AppSidebar } from '@/components/AppSidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useAuthStore } from '@/stores/authStore';
import { ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router';

const routeTitleKeys: Record<string, string> = {
  '/dashboard': 'nav.dashboard',
  '/manager/monitor': 'nav.monitor',
  '/vips': 'nav.vips',
  '/events': 'nav.events',
  '/sessions': 'nav.sessions',
  '/cameras': 'nav.cameras',
  '/users': 'nav.users',
  '/account-devices': 'nav.accountDevices',
  '/settings': 'settings.title',
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const isRTL = i18n.language === 'ar';
  const pageTitle = routeTitleKeys[location.pathname] || 'nav.dashboard';

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full overflow-hidden">
        <AppSidebar side={isRTL ? 'right' : 'left'} />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Header matching reference design */}
          <header className="h-14 border-b border-border flex items-center justify-between px-2 sm:px-4 gap-2 sm:gap-4 bg-card/80 backdrop-blur-sm sticky top-0 z-30">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <SidebarTrigger className="shrink-0" />
              <span className="text-xs sm:text-sm text-muted-foreground shrink-0">VAS</span>
              <ChevronRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground rtl:rotate-180 shrink-0" />
              <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
                {t(pageTitle)}
              </span>
            </div>

            {/* User info + bell */}
            <div className="flex items-center gap-1.5 sm:gap-3 shrink-0 flex-row-reverse">
              {user && (
                <div className="flex items-center gap-2">
                  <div className="hidden sm:block text-end">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    {user.email && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">{user.email}</p>
                    )}
                    <p className="text-[11px] text-primary mt-0.5 uppercase tracking-wider">
                      {t(`users.${user.role.toLowerCase()}`)}
                    </p>
                  </div>
                  <Avatar>
                    <AvatarFallback className="bg-muted text-[10px] sm:text-xs font-medium">
                      <div className="w-10 h-10 rounded-2xl bg-[#1e293b] overflow-hidden ring-4 ring-[#1e293b]/30">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email ?? user.name}`} alt="Avatar" />
                      </div>
                    </AvatarFallback>
                  </Avatar>
                </div>
              )}
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
