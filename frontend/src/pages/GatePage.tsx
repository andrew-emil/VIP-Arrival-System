import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GateLayout } from '@/layouts/GateLayout';
import { GateAlertCard } from '@/components/GateAlertCard';
import { useAlertStore } from '@/stores/alertStore';
import { useSSE } from '@/hooks/useSSE';
import { Shield } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getArrivedSessions } from '@/services/sessions/query';
import { SessionsQueryKeys } from '@/services/sessions/queryKeys';
import { Alert, ProtocolLevel, RealtimeEvent } from '@/types';
import { SessionStatus } from '@/services/sessions/types';

export default function GatePage() {
  const { t } = useTranslation();
  const alerts = useAlertStore((s) => s.alerts);
  const setAlerts = useAlertStore((s) => s.setAlerts);
  const [isHydrated, setIsHydrated] = useState(false);

  useSSE();

  useEffect(() => {
    const unsub = useAlertStore.persist.onFinishHydration(() => setIsHydrated(true));
    if (useAlertStore.persist.hasHydrated()) setIsHydrated(true);
    return unsub;
  }, []);

  const { data: arrivedSessions } = useQuery({
    queryKey: SessionsQueryKeys.findArrived(),
    queryFn: getArrivedSessions,
  });

  useEffect(() => {
    if (!arrivedSessions) return;

    const apiAlerts: Alert[] = arrivedSessions.map((session) => ({
      id: session.id,
      vipId: session.vip.id,
      vipName: session.vip.name,
      plateNumber: (session.vip as unknown as { plate?: string }).plate || 'N/A',
      protocolLevel: (session.vip.protocolLevel as ProtocolLevel) || 'C',
      status: session.status,
      timestamp: session.arrivedAt ? new Date(session.arrivedAt).toISOString() : new Date(session.createdAt).toISOString(),
      company: session.vip.company || 'N/A',
      vipPhoto: session.vip.photoUrl || undefined,
    }));

    const currentAlerts = useAlertStore.getState().alerts;
    const nonArrived = currentAlerts.filter((a) => a.status !== RealtimeEvent.VIP_ARRIVED && a.status !== SessionStatus.ARRIVED);

    // We want to avoid unnecessary state updates if lengths and IDs exactly match
    // to prevent jitter or infinite loops if something else triggers this
    const newMerged = [...apiAlerts, ...nonArrived].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    setAlerts(newMerged);
  }, [arrivedSessions, setAlerts]);

  const arrivedAlerts = alerts.filter(
    (a) => a.status === RealtimeEvent.VIP_ARRIVED || a.status === SessionStatus.ARRIVED
  );

  if (!isHydrated) return null;

  return (
    <GateLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col items-center text-center space-y-2 mb-4">
          <div className="p-3 bg-primary/10 rounded-full mb-2">
            <Shield className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">{t('gate.title')}</h1>
          <p className="text-muted-foreground">{t('gate.subtitle')}</p>
        </div>

        {arrivedAlerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 px-4 border-2 border-dashed rounded-3xl bg-muted/30">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6">
              <Shield className="h-8 w-8 text-muted-foreground/50" />
            </div>
            <p className="text-xl font-medium text-muted-foreground">{t('gate.noArrivals')}</p>
            <p className="text-sm text-muted-foreground/70 mt-2 max-w-xs text-center">
              {t('gate.noArrivalsDesc')}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6">
            {arrivedAlerts.map((alert) => (
              <GateAlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </GateLayout>
  );
}
