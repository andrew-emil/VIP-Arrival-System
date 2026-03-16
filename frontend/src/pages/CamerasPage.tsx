import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useCameraStore } from '@/stores/cameraStore';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

export default function CamerasPage() {
  const { t } = useTranslation();
  const cameras = useCameraStore((s) => s.cameras);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">{t('cameras.title')}</h1>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.name')}</TableHead>
                <TableHead>{t('cameras.location')}</TableHead>
                <TableHead>{t('cameras.cameraRole')}</TableHead>
                <TableHead>{t('cameras.lastSeen')}</TableHead>
                <TableHead>{t('cameras.health')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cameras.map((cam) => (
                <TableRow key={cam.id}>
                  <TableCell className="font-medium">{cam.name}</TableCell>
                  <TableCell>{cam.location}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{t(`cameras.${cam.role}`)}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {new Date(cam.lastSeen).toLocaleTimeString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full', cam.isOnline ? 'bg-alert-arrived' : 'bg-alert-error')} />
                      <span className="text-xs">{cam.isOnline ? t('common.online') : t('common.offline')}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
}
