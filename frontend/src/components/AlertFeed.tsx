import { useAlertStore } from '@/stores/alertStore';
import { AlertCard } from './AlertCard';
import { useTranslation } from 'react-i18next';
import { Alert } from '@/types';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AlertFeedProps {
  filter?: (a: Alert) => boolean;
  onAlertClick?: (alert: Alert) => void;
}

export function AlertFeed({ filter, onAlertClick }: AlertFeedProps) {
  const { t } = useTranslation();
  const alerts = useAlertStore((s) => s.alerts);
  const filtered = filter ? alerts.filter(filter) : alerts;

  return (
    <div className="flex flex-col h-full">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-1">
        {t('alerts.title')} ({filtered.length})
      </h3>
      <ScrollArea className="flex-1">
        <div className="space-y-2 pe-2">
          {filtered.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-8">{t('alerts.noAlerts')}</p>
          )}
          {filtered.map((alert) => (
            <AlertCard key={alert.id} alert={alert} onClick={() => onAlertClick?.(alert)} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
