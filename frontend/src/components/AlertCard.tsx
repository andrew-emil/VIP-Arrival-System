import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Alert, RealtimeEvent } from '@/types';
import { SessionStatus } from '@/services/sessions/types';
import { useTranslation } from 'react-i18next';

interface AlertCardProps {
  alert: Alert;
  onClick?: () => void;
}


const statusColors: Record<string, string> = {
  [RealtimeEvent.ALERT_CREATED]: 'bg-alert-approaching text-foreground',
  [RealtimeEvent.VIP_ARRIVED]: 'bg-alert-arrived text-primary-foreground',
  [RealtimeEvent.VIP_CONFIRMED]: 'bg-alert-confirmed text-primary-foreground',
  [RealtimeEvent.VIP_REJECTED]: 'bg-alert-error text-primary-foreground',
  [RealtimeEvent.VIP_COMPLETED]: 'bg-muted text-muted-foreground',
  [RealtimeEvent.VIP_ADDED]: 'bg-blue-500 text-white',
  [RealtimeEvent.VIP_STATUS_CHANGED]: 'bg-blue-500 text-white',
  // SessionStatus variants
  [SessionStatus.APPROACHING]: 'bg-alert-approaching text-foreground',
  [SessionStatus.ARRIVED]: 'bg-alert-arrived text-primary-foreground',
  [SessionStatus.CONFIRMED]: 'bg-alert-confirmed text-primary-foreground',
  [SessionStatus.REJECTED]: 'bg-alert-error text-primary-foreground',
  [SessionStatus.COMPLETED]: 'bg-muted text-muted-foreground',
};

const statusBorder: Record<string, string> = {
  [RealtimeEvent.ALERT_CREATED]: 'border-alert-approaching/30',
  [RealtimeEvent.VIP_ARRIVED]: 'border-alert-arrived/30',
  [RealtimeEvent.VIP_CONFIRMED]: 'border-alert-confirmed/30',
  [RealtimeEvent.VIP_REJECTED]: 'border-alert-error/30',
  [RealtimeEvent.VIP_COMPLETED]: 'border-muted/30',
  [RealtimeEvent.VIP_ADDED]: 'border-blue-500/30',
  [RealtimeEvent.VIP_STATUS_CHANGED]: 'border-blue-500/30',
  // SessionStatus variants
  [SessionStatus.APPROACHING]: 'border-alert-approaching/30',
  [SessionStatus.ARRIVED]: 'border-alert-arrived/30',
  [SessionStatus.CONFIRMED]: 'border-alert-confirmed/30',
  [SessionStatus.REJECTED]: 'border-alert-error/30',
  [SessionStatus.COMPLETED]: 'border-muted/30',
};

export function AlertCard({ alert, onClick }: AlertCardProps) {
  const { t } = useTranslation();

  const time = new Date(alert.timestamp).toLocaleTimeString('ar-SA', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  return (
    <Card
      className={cn(
        'p-4 cursor-pointer transition-all hover:shadow-md animate-slide-in border',
        statusBorder[alert.status]
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-card-foreground truncate">{alert.vipName}</span>
            <Badge className={cn('text-[10px] px-1.5 py-0', statusColors[alert.status])}>
              {t(`alerts.${alert.status.toLocaleLowerCase()}`)}
            </Badge>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground flex-wrap">
            <span className="font-mono text-foreground/80">{alert.plateNumber}</span>
            <span>{alert.company}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{t('alerts.protocol')}: {alert.protocolLevel}</span>
            <span>{alert.cameraName}</span>
            <span className="font-mono">{time}</span>
          </div>
        </div>
        <div className="shrink-0 w-10 h-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-lg font-bold">
          {alert.protocolLevel}
        </div>
      </div>
    </Card>
  );
}
