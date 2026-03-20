import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';
import { DevicesQueryKeys, deactivateDevice, deleteDevice, findAllDevices, regeneratePassword } from '@/services/devices';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, KeyRound, Loader2, MoreHorizontal, PowerOff, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';

export function AccountDevicesTable() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const isRtl = i18n.language === 'ar';


  const { data: devices = [], isLoading } = useQuery({
    queryKey: DevicesQueryKeys.findAll(),
    queryFn: findAllDevices,
  });

  const deactivateMutation = useMutation({
    mutationFn: deactivateDevice,
    onSuccess: () => {
      toast.success(t('devices.deactivateSuccess'));
      queryClient.invalidateQueries({ queryKey: DevicesQueryKeys.findAll() });
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error', 'An error occurred'));
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDevice,
    onSuccess: () => {
      toast.success(t('devices.deleteSuccess', 'Device deleted successfully'));
      queryClient.invalidateQueries({ queryKey: DevicesQueryKeys.findAll() });
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error', 'An error occurred'));
    }
  });

  const regeneratePasswordMutation = useMutation({
    mutationFn: regeneratePassword,
    onSuccess: (data) => {
      toast.success(t('devices.passwordRegenerated'));
      if (data?.temporaryPassword) {
        toast.success(t('devices.newPassword', { password: data.temporaryPassword }), {
          duration: 10000,
          action: {
            label: t('common.copy', 'Copy'),
            onClick: () => {
              if (data.temporaryPassword) {
                navigator.clipboard.writeText(data.temporaryPassword);
                toast.success(t('common.copied', 'Copied to clipboard'));
              }
            }
          }
        });
      }
      queryClient.invalidateQueries({ queryKey: DevicesQueryKeys.findAll() });
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error', 'An error occurred'));
    }
  });

  return (
    <div className="rounded-lg border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('common.name')}</TableHead>
            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('devices.location')}</TableHead>
            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('devices.cameraRole')}</TableHead>
            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('devices.deviceId', 'Device ID')}</TableHead>
            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('devices.lastSeen')}</TableHead>
            <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('devices.health')}</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
              </TableCell>
            </TableRow>
          ) : devices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                {t('common.noData')}
              </TableCell>
            </TableRow>
          ) : devices.map((device) => {
            return (
              <TableRow key={device.id}>
                <TableCell className="font-medium">{device.name}</TableCell>
                <TableCell>{device.camera?.location || '-'}</TableCell>
                <TableCell>
                  {device.camera?.role && (
                    <Badge variant="secondary">
                      {t(`devices.${device.camera.role.toLowerCase()}`)}
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground truncate max-w-[120px]" title={device.id}>
                      {device.id}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(device.id);
                        toast.success(t('common.copied', 'Copied to clipboard'));
                      }}
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </Button>
                  </div>
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
                        {t('devices.regeneratePassword')}
                      </DropdownMenuItem>
                      {device.isActive && (
                        <DropdownMenuItem
                          onClick={() => deactivateMutation.mutate(device.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <PowerOff className="mr-2 h-4 w-4" />
                          {t('devices.deactivate')}
                        </DropdownMenuItem>
                      )}

                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => deleteMutation.mutate(device.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        {t('common.delete', 'Delete')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
