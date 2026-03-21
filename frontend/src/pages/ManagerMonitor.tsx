import { AlertFeed } from '@/components/AlertFeed';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSSE } from '@/hooks/useSSE';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { getSessions, SessionsQueryKeys } from '@/services/sessions';
import { useAlertStore } from '@/stores/alertStore';
import { Alert, RealtimeEvent } from '@/types';
import { useQuery } from '@tanstack/react-query';
import { Car, CheckCircle, Radio, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export default function ManagerMonitor() {
  const { t } = useTranslation();
  const alerts = useAlertStore((s) => s.alerts);
  const setAlerts = useAlertStore((s) => s.setAlerts);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const unsub = useAlertStore.persist.onFinishHydration(() => setIsHydrated(true));
    if (useAlertStore.persist.hasHydrated()) setIsHydrated(true);
    return unsub;
  }, []);

  const { data: sessions, isSuccess } = useQuery({
    queryKey: SessionsQueryKeys.all(),
    queryFn: getSessions,
  });

  useEffect(() => {
    if (isSuccess && sessions) {
      const mappedAlerts: Alert[] = sessions.map(session => ({
        id: session.id,
        vipId: session.vip?.id || session.vipId,
        vipName: session.vip?.name || 'Unknown VIP',
        plateNumber: (session.vip as unknown as { plate?: string })?.plate || 'N/A',
        protocolLevel: (session.vip?.protocolLevel as Alert['protocolLevel']) || 'C',
        status: session.status,
        timestamp: (session.approachAt || session.arrivedAt || session.createdAt || new Date()).toString(),
        company: session.vip?.company || 'N/A',
        vipPhoto: session.vip?.photoUrl || undefined,
      }));
      setAlerts(mappedAlerts);
    }
  }, [sessions, isSuccess, setAlerts]);

  useSSE();

  const approaching = alerts.filter((a) => a.status === RealtimeEvent.ALERT_CREATED || a.status === 'APPROACHING').length;
  const arrived = alerts.filter((a) => a.status === RealtimeEvent.VIP_ARRIVED || a.status === 'ARRIVED').length;
  const confirmed = alerts.filter((a) => a.status === RealtimeEvent.VIP_CONFIRMED || a.status === 'CONFIRMED').length;
  const active = approaching + arrived;

  if (!isHydrated) return null;

  const metrics = [
    { label: t('dashboard.activeSessions'), value: active, icon: Users, color: 'text-primary' },
    { label: t('dashboard.approaching'), value: approaching, icon: Car, color: 'text-alert-approaching' },
    { label: t('dashboard.arrived'), value: arrived, icon: Radio, color: 'text-alert-arrived' },
    { label: t('dashboard.confirmed'), value: confirmed, icon: CheckCircle, color: 'text-alert-confirmed' },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('nav.monitor')}</h1>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((m) => (
            <Card key={m.label}>
              <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">{m.label}</CardTitle>
                <m.icon className={`h-4 w-4 ${m.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{m.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="h-[calc(100vh-300px)]">
          {/* Read-only: no onAlertClick handler */}
          <AlertFeed />
        </div>
      </div>
    </DashboardLayout>
  );
}
