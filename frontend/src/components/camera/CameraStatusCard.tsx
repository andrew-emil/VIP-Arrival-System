import { Camera } from '@/types';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/components/ui/badge';
import { cn, getTimeAgo } from '@/lib/utils';

interface CameraStatusCardProps {
  camera: Camera;
}

export function CameraStatusCard({ camera }: CameraStatusCardProps) {
  const { t } = useTranslation();
  const ago = getTimeAgo(camera.lastSeen);

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-card-foreground text-sm">{camera.name}</h4>
        <div className={cn('w-2.5 h-2.5 rounded-full', camera.isOnline ? 'bg-alert-arrived' : 'bg-alert-error')} />
      </div>
      <div className="space-y-1 text-xs text-muted-foreground">
        <div className="flex justify-between">
          <span>{t('cameras.location')}</span>
          <span className="text-foreground">{camera.location}</span>
        </div>
        <div className="flex justify-between">
          <span>{t('cameras.cameraRole')}</span>
          <Badge variant="secondary" className="text-[10px]">
            {t(`cameras.${camera.role}`)}
          </Badge>
        </div>
        <div className="flex justify-between">
          <span>{t('cameras.lastSeen')}</span>
          <span className="font-mono text-foreground">{ago}</span>
        </div>
      </div>
    </Card>
  );
}

