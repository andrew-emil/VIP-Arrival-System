import { useTranslation } from 'react-i18next';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { findAllDevices, DevicesQueryKeys, deactivateDevice, regeneratePassword } from '@/services/devices';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AddDeviceDialog } from '@/components/AddDeviceDialog';
import { cn } from '@/lib/utils';
import { Loader2, MoreHorizontal, KeyRound, PowerOff } from 'lucide-react';
import { toast } from 'sonner';

export default function AccountDevicePage() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const { data: devices = [], isLoading } = useQuery({
    queryKey: DevicesQueryKeys.findAll(),
    queryFn: findAllDevices,
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateDevice,
    onSuccess: () => {
      toast.success(t('cameras.deactivateSuccess'));
      queryClient.invalidateQueries({ queryKey: DevicesQueryKeys.all() });
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error', 'An error occurred'));
    }
  });

  const regeneratePasswordMutation = useMutation({
    mutationFn: regeneratePassword,
    onSuccess: (data) => {
      toast.success(t('cameras.passwordRegenerated'));
      if (data?.temporaryPassword) {
        toast.info(t('cameras.newPassword', { password: data.temporaryPassword }), {
          duration: 10000,
        });
      }
      queryClient.invalidateQueries({ queryKey: DevicesQueryKeys.all() });
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error', 'An error occurred'));
    }
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('cameras.title')}</h1>
          <AddDeviceDialog />
        </div>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('common.name')}</TableHead>
                <TableHead>{t('cameras.location')}</TableHead>
                <TableHead>{t('cameras.cameraRole')}</TableHead>
                <TableHead>{t('cameras.lastSeen')}</TableHead>
                <TableHead>{t('cameras.health')}</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell className="font-medium">{device.name}</TableCell>
                  <TableCell>{device.camera?.location || '-'}</TableCell>
                  <TableCell>
                    {device.camera?.role && <Badge variant="secondary">{t(`cameras.${device.camera.role.toLowerCase()}`)}</Badge>}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {device.camera?.lastSeen ? new Date(device.camera.lastSeen).toLocaleTimeString() : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={cn('w-2 h-2 rounded-full', device.isActive ? 'bg-alert-arrived' : 'bg-alert-error')} />
                      <span className="text-xs">{device.isActive ? t('common.online') : t('common.offline')}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>{t('common.actions')}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => regeneratePasswordMutation.mutate(device.id)}>
                          <KeyRound className="mr-2 h-4 w-4" />
                          {t('cameras.regeneratePassword')}
                        </DropdownMenuItem>
                        {device.isActive && (
                          <DropdownMenuItem
                            onClick={() => deactivateMutation.mutate(device.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <PowerOff className="mr-2 h-4 w-4" />
                            {t('cameras.deactivate')}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
