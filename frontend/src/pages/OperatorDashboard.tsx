import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { AlertFeed } from '@/components/AlertFeed';
import { VipDrawer } from '@/components/vip/VipDrawer';
import { useSSE } from '@/hooks/useSSE';
import { useAlertStore } from '@/stores/alertStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert } from '@/types';
import { Users, Car, Radio, CheckCircle } from 'lucide-react';

export default function OperatorDashboard() {
  const { t } = useTranslation();
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const alerts = useAlertStore((s) => s.alerts);
  useSSE();

  const approaching = alerts.filter((a) => a.status === 'APPROACHING').length;
  const arrived = alerts.filter((a) => a.status === 'ARRIVED').length;
  const confirmed = alerts.filter((a) => a.status === 'CONFIRMED').length;

  const metrics = [
    { label: t('dashboard.activeSessions'), value: approaching + arrived, icon: Users, color: 'text-primary' },
    { label: t('dashboard.approaching'), value: approaching, icon: Car, color: 'text-alert-approaching' },
    { label: t('dashboard.arrived'), value: arrived, icon: Radio, color: 'text-alert-arrived' },
    { label: t('dashboard.confirmed'), value: confirmed, icon: CheckCircle, color: 'text-alert-confirmed' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('dashboard.operationsCenter')}</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <Card key={m.label}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{m.label}</CardTitle>
                <m.icon className={`h-4 w-4 ${m.color}`} />
              </CardHeader>
              <CardContent><div className="text-3xl font-bold">{m.value}</div></CardContent>
            </Card>
          ))}
        </div>
        <div className="h-[calc(100vh-300px)]">
          <AlertFeed onAlertClick={(a) => setSelectedAlert(a)} />
        </div>
      </div>
      <VipDrawer alert={selectedAlert} open={!!selectedAlert} onClose={() => setSelectedAlert(null)} />
    </DashboardLayout>
  );
}
