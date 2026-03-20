import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DeviceLoginForm } from '@/components/account-devices/DeviceLoginForm';
import { UserLoginForm } from '@/components/user/UserLoginForm';
import { Globe, Shield } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function LoginPage() {
  const { t, i18n } = useTranslation();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const toggleLang = () => {
    const next = i18n.language === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(next);
    document.documentElement.dir = next === 'ar' ? 'rtl' : 'ltr';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="absolute top-4 end-4">
        <Button variant="ghost" size="icon" onClick={toggleLang}>
          <Globe className="h-4 w-4" />
        </Button>
      </div>
      <Card
        className={`w-full max-w-sm transition-all duration-500 ease-out ${show
          ? 'opacity-100 translate-y-0 scale-100'
          : 'opacity-0 translate-y-8 scale-95'
          }`}
      >
        <CardHeader className="text-center space-y-3">
          <div className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-xl">{t('login.title')}</CardTitle>
          <CardDescription>{t('login.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="user" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="user">{t('login.userMode', 'User')}</TabsTrigger>
              <TabsTrigger value="device">{t('login.deviceMode', 'Gate Guard')}</TabsTrigger>
            </TabsList>
            <TabsContent value="user">
              <UserLoginForm />
            </TabsContent>
            <TabsContent value="device">
              <DeviceLoginForm />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
