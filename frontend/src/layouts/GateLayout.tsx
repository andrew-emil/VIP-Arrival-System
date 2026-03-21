import { Button } from '@/components/ui/button';
import { VAS_ICONS } from "@/config/icons";
import { useAuthStore } from "@/stores/authStore";
import { useThemeStore } from "@/stores/themeStore";
import { Globe, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

export function GateLayout({ children }: { children: React.ReactNode }) {
  const { i18n, t } = useTranslation();
  const { theme, setTheme } = useThemeStore();
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  function toggleLang() {
    const next = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark');
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4 mx-auto">
          {/* Logo Section */}
          <div className="flex items-center gap-2 md:gap-4" dir="ltr">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(147,51,234,0.3)] shrink-0">V</div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-sm font-black tracking-tighter leading-none">VAS GATE</span>
              <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mt-0.5">PLATFORM_v2.5</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">

            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
              {
                theme === 'dark' ? <VAS_ICONS.moon className="h-4 w-4" /> :
                  theme === 'light' ? <VAS_ICONS.sun className="h-4 w-4" /> :
                    <VAS_ICONS.monitor className="h-4 w-4" />
              }
            </Button>

            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleLang}>
              <Globe className="h-4 w-4" />
            </Button>

            <div className="w-[1px] h-6 bg-border mx-1" />

            <Button
              variant="ghost"
              size="sm"
              className="text-rose-500 hover:bg-rose-500/10 gap-2 px-3"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">{t('common.logout')}</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="h-full w-full">
          {children}
        </div>
      </main>
    </div>
  );
}
