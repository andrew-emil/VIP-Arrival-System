import { useTranslation } from 'react-i18next';
import { GateLayout } from '@/layouts/GateLayout';
import { GateAlertCard } from '@/components/GateAlertCard';
import { useAlertStore } from '@/stores/alertStore';
import { useSSE } from '@/hooks/useSSE';
import { Shield } from 'lucide-react';

export default function GatePage() {
  const { t } = useTranslation();
  const alerts = useAlertStore((s) => s.alerts);
  useSSE();

  const arrivedAlerts = alerts.filter((a) => a.status === 'ARRIVED');

  return (
    <GateLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">{t('gate.title')}</h1>
        </div>

        {arrivedAlerts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-lg text-muted-foreground">{t('gate.noArrivals')}</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {arrivedAlerts.map((alert) => (
              <GateAlertCard key={alert.id} alert={alert} />
            ))}
          </div>
        )}
      </div>
    </GateLayout>
  );
}
