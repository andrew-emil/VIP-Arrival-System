import { Alert } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useAlertStore } from '@/stores/alertStore';
import { Check, X } from 'lucide-react';

interface GateAlertCardProps {
  alert: Alert;
}

export function GateAlertCard({ alert }: GateAlertCardProps) {
  const { t } = useTranslation();
  const confirmAlert = useAlertStore((s) => s.confirmAlert);
  const rejectAlert = useAlertStore((s) => s.rejectAlert);

  const time = new Date(alert.timestamp).toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="p-6 space-y-5 border-alert-arrived/20">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground shrink-0">
          {alert.vipName.charAt(0)}
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-card-foreground truncate">{alert.vipName}</h3>
          <p className="text-sm text-muted-foreground">{alert.company}</p>
        </div>
      </div>
      <div className="flex items-center gap-4 text-sm">
        <span className="font-mono text-foreground bg-muted px-2 py-1 rounded">{alert.plateNumber}</span>
        <span className="text-muted-foreground">{t('gate.arrivalTime')}: {time}</span>
      </div>
      <div className="flex gap-3">
        <Button
          size="lg"
          className="flex-1 h-14 text-base gap-2 bg-alert-arrived hover:bg-alert-arrived/90 text-primary-foreground"
          onClick={() => confirmAlert(alert.id)}
        >
          <Check className="h-5 w-5" />
          {t('gate.confirmArrival')}
        </Button>
        <Button
          size="lg"
          variant="destructive"
          className="flex-1 h-14 text-base gap-2"
          onClick={() => rejectAlert(alert.id)}
        >
          <X className="h-5 w-5" />
          {t('gate.rejectArrival')}
        </Button>
      </div>
    </Card>
  );
}
