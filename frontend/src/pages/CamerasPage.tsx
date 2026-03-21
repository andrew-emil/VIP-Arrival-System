import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import {
  getCameras,
  getCameraHealth,
  deleteCamera,
  CameraQueryKeys,
  ICamera,
  ICameraHealth,
} from '@/services/camera';

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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, MoreHorizontal, Eye, Edit, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import { AddCameraDialog } from '@/components/camera/AddCameraDialog';
import { EditCameraDialog } from '@/components/camera/EditCameraDialog';
import { CameraDetailsDialog } from '@/components/camera/CameraDetailsDialog';

export default function CamerasPage() {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const isRtl = i18n.language === 'ar';

  const [editingCamera, setEditingCamera] = useState<ICamera | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const [viewingCamera, setViewingCamera] = useState<ICamera | null>(null);
  const [viewingHealth, setViewingHealth] = useState<ICameraHealth | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const { data: cameras = [], isLoading: isLoadingCameras } = useQuery({
    queryKey: CameraQueryKeys.findAll(),
    queryFn: getCameras,
  });

  const { data: healthData = [], isLoading: isLoadingHealth } = useQuery({
    queryKey: CameraQueryKeys.health(),
    queryFn: getCameraHealth,
    refetchInterval: 30000, // Refresh health every 30s
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCamera,
    onSuccess: () => {
      toast.success(t('cameras.deleteSuccess'));
      queryClient.invalidateQueries({ queryKey: CameraQueryKeys.findAll() });
      setDeleting(null);
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error', 'An error occurred'));
      setDeleting(null);
    }
  });

  const handleDelete = (id: string) => {
    setDeleting(id);
  };

  const handleEdit = (camera: ICamera) => {
    setEditingCamera(camera);
    setIsEditDialogOpen(true);
  };

  const handleViewDetails = (camera: ICamera) => {
    const health = healthData.find(h => h.id === camera.id) || null;
    setViewingCamera(camera);
    setViewingHealth(health);
    setIsDetailsDialogOpen(true);
  };

  const isLoading = isLoadingCameras || isLoadingHealth;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('nav.cameras')}</h1>
          <AddCameraDialog />
        </div>

        <div className="rounded-lg border bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('common.name')}</TableHead>
                <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('cameras.ipAddress')}</TableHead>
                <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('cameras.cameraRole')}</TableHead>
                <TableHead className={isRtl ? 'text-right' : 'text-left'}>{t('cameras.health')}</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  </TableCell>
                </TableRow>
              ) : cameras.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    {t('common.noData')}
                  </TableCell>
                </TableRow>
              ) : cameras.map((camera) => {
                const health = healthData.find(h => h.id === camera.id);
                const isOnline = health?.isOnline ?? false;

                return (
                  <TableRow key={camera.id}>
                    <TableCell className="font-medium cursor-pointer" onClick={() => handleViewDetails(camera)}>
                      {camera.name}
                    </TableCell>
                    <TableCell className="font-mono text-sm">{camera.ip}</TableCell>
                    <TableCell>
                      <Badge variant={camera.role === 'GATE' ? 'default' : 'secondary'} className="uppercase">
                        {t(`cameras.${camera.role.toLowerCase()}`)}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", isOnline ? "bg-alert-arrived" : "bg-alert-error")} />
                        <span className={cn("text-xs font-medium", isOnline ? "text-alert-arrived" : "text-alert-error")}>
                          {isOnline ? t('common.online') : t('common.offline')}
                        </span>
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
                          <DropdownMenuItem onClick={() => handleViewDetails(camera)}>
                            <Eye className="mr-2 h-4 w-4" />
                            {t('common.view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(camera)}>
                            <Edit className="mr-2 h-4 w-4" />
                            {t('common.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(camera.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            {t('common.delete')}
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
      </div>

      <EditCameraDialog 
        camera={editingCamera} 
        isOpen={isEditDialogOpen} 
        onOpenChange={setIsEditDialogOpen} 
      />

      <CameraDetailsDialog 
        camera={viewingCamera} 
        health={viewingHealth}
        isOpen={isDetailsDialogOpen} 
        onOpenChange={setIsDetailsDialogOpen} 
      />

      <AlertDialog open={!!deleting} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('common.delete', 'Delete')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('cameras.confirmDelete', 'Are you sure you want to delete this camera?')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteMutation.isPending}>{t('common.cancel', 'Cancel')}</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                if (deleting) deleteMutation.mutate(deleting);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {t('common.confirm', 'Confirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DashboardLayout>
  );
}
