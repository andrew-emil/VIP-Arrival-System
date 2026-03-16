import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useThemeStore } from '@/stores/themeStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Sun, Moon, Monitor, Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useThemeStore();
  const currentLang = i18n.language;

  const switchLang = (lang: string) => {
    i18n.changeLanguage(lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const themeOptions = [
    { value: 'light' as const, label: t('settings.light'), icon: Sun },
    { value: 'dark' as const, label: t('settings.dark'), icon: Moon },
    { value: 'system' as const, label: t('settings.system'), icon: Monitor },
  ];

  const langOptions = [
    { value: 'ar', label: 'العربية', desc: 'Arabic' },
    { value: 'en', label: 'English', desc: 'الإنجليزية' },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">{t('settings.title')}</h1>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('settings.appearance')}</CardTitle>
            <CardDescription>{t('settings.appearanceDesc')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Label className="text-sm font-medium mb-3 block">{t('settings.theme')}</Label>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((opt) => (
                <Button
                  key={opt.value}
                  variant={theme === opt.value ? 'default' : 'outline'}
                  className={cn(
                    'h-auto flex-col gap-2 py-4',
                    theme === opt.value && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
                  )}
                  onClick={() => setTheme(opt.value)}
                >
                  <opt.icon className="h-5 w-5" />
                  <span className="text-xs">{opt.label}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('settings.language')}</CardTitle>
            <CardDescription>{t('settings.languageDesc')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {langOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => switchLang(opt.value)}
                className={cn(
                  'w-full flex items-center justify-between p-4 rounded-lg border transition-colors',
                  currentLang === opt.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:bg-accent'
                )}
              >
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-muted-foreground" />
                  <div className="text-start">
                    <p className="font-medium">{opt.label}</p>
                    <p className="text-xs text-muted-foreground">{opt.desc}</p>
                  </div>
                </div>
                {currentLang === opt.value && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </button>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
