import { Alert } from '@/types';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { useVipStore } from '@/stores/vipStore';

interface VipDrawerProps {
  alert: Alert | null;
  open: boolean;
  onClose: () => void;
}

export function VipDrawer({ alert, open, onClose }: VipDrawerProps) {
  const { t } = useTranslation();
  const vipList = useVipStore((s) => s.vipList);

  if (!alert) return null;
  const vip = vipList.find((v) => v.id === alert.vipId);

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{alert.vipName}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground mx-auto">
            {alert.vipName.charAt(0)}
          </div>
          <div className="space-y-3">
            <InfoRow label={t('common.company')} value={alert.company} />
            <InfoRow label={t('vips.protocolLevel')} value={<Badge variant="outline">{alert.protocolLevel}</Badge>} />
            <InfoRow label={t('alerts.plate')} value={<span className="font-mono">{alert.plateNumber}</span>} />
            <InfoRow label={t('alerts.camera')} value={alert.cameraName} />
            <InfoRow label={t('common.status')} value={t(`alerts.${alert.status.toLowerCase()}`)} />
            {vip?.notes && <InfoRow label={t('common.notes')} value={vip.notes} />}
            {vip && vip.plateNumbers.length > 1 && (
              <InfoRow
                label={t('vips.plateNumbers')}
                value={
                  <div className="flex flex-wrap gap-1">
                    {vip.plateNumbers.map((p) => (
                      <Badge key={p} variant="secondary" className="font-mono text-xs">{p}</Badge>
                    ))}
                  </div>
                }
              />
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-end">{value}</span>
    </div>
  );
}
