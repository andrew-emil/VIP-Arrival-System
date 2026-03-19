import { useTranslation } from 'react-i18next';
import { ICamera, ICameraHealth } from '@/services/camera';
import { useEventStore } from '@/stores/eventStore';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Wifi, Disc, MapPin, Globe, Hash, Clock } from 'lucide-react';

interface CameraDetailsDialogProps {
  camera: ICamera | null;
  health: ICameraHealth | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CameraDetailsDialog({ camera, health, isOpen, onOpenChange }: CameraDetailsDialogProps) {
  const { t } = useTranslation();
  const events = useEventStore((s) => s.events);

  if (!camera) return null;

  const eventName = events.find(e => e.id === camera.eventId)?.name || camera.eventId;
  const isOnline = health?.isOnline ?? false;
  const lastSeen = health?.lastSeen || camera.lastSeen;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Disc className="h-5 w-5 text-primary" />
            {t('cameras.detailsTitle')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between border-b pb-4">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">{camera.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {t('cameras.ipAddress')}: <span className="font-mono">{camera.ip}</span>
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={camera.role === 'GATE' ? 'default' : 'secondary'} className="uppercase">
                {t(`cameras.${camera.role.toLowerCase()}`)}
              </Badge>
              <div className="flex items-center gap-1.5 text-sm font-medium">
                <div className={cn("w-2 h-2 rounded-full", isOnline ? "bg-alert-arrived" : "bg-alert-error")} />
                <span className={isOnline ? "text-alert-arrived" : "text-alert-error"}>
                  {isOnline ? t('common.online') : t('common.offline')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 text-sm">
            <div className="flex items-center gap-3">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{t('events.event')}</p>
                <p className="text-muted-foreground">{eventName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{t('cameras.location', 'Location')}</p>
                <p className="text-muted-foreground">{camera.location || '-'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Hash className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{t('common.id')}</p>
                <p className="text-muted-foreground font-mono text-xs">{camera.id}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="font-medium">{t('cameras.lastSeen', 'Last Seen')}</p>
                <p className="text-muted-foreground">
                  {lastSeen ? new Date(lastSeen).toLocaleString() : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
