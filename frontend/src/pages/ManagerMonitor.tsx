import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AlertFeed } from '@/components/AlertFeed';
import { useSSE } from '@/hooks/useSSE';
import { useAlertStore } from '@/stores/alertStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Car, Radio } from 'lucide-react';

export default function ManagerMonitor() {
  const { t } = useTranslation();
  const alerts = useAlertStore((s) => s.alerts);
  useSSE();

  const approaching = alerts.filter((a) => a.status === 'APPROACHING').length;
  const arrived = alerts.filter((a) => a.status === 'ARRIVED').length;
  const active = approaching + arrived;

  const metrics = [
    { label: t('dashboard.activeSessions'), value: active, icon: Users },
    { label: t('dashboard.approaching'), value: approaching, icon: Car },
    { label: t('dashboard.arrived'), value: arrived, icon: Radio },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('nav.monitor')}</h1>
        <div className="grid grid-cols-3 gap-4">
          {metrics.map((m) => (
            <Card key={m.label}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{m.label}</CardTitle>
                <m.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-3xl font-bold">{m.value}</div></CardContent>
            </Card>
          ))}
        </div>
        <div className="h-[calc(100vh-300px)]">
          <AlertFeed />
        </div>
      </div>
    </DashboardLayout>
  );
}
