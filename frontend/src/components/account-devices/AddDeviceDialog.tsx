import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getCameras } from '@/services/camera/query';
import { createDevice, DevicesQueryKeys } from '@/services/devices';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import type { TFunction } from 'i18next';

const getCreateDeviceSchema = (t: TFunction) => z.object({
  name: z.string().min(1, t('devices.nameRequired', 'Device name is required')),
  cameraId: z.string().min(1, t('cameras.cameraIdRequired', 'Camera ID is required')),
});

type CreateDeviceFormValues = z.infer<ReturnType<typeof getCreateDeviceSchema>>;

export function AddDeviceDialog() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: cameras = [], isLoading: isLoadingCameras } = useQuery({
    queryKey: ['cameras'],
    queryFn: getCameras,
  });

  const form = useForm<CreateDeviceFormValues>({
    resolver: zodResolver(getCreateDeviceSchema(t)),
    defaultValues: {
      name: '',
      cameraId: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: createDevice,
    onSuccess: (data) => {
      toast.success(t('devices.createSuccess'));
      if (data?.temporaryPassword) {
        toast.info(t('devices.newPassword', { password: data.temporaryPassword }), {
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
      queryClient.invalidateQueries({ queryKey: DevicesQueryKeys.all() });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error', 'An error occurred'));
    }
  });

  const onSubmit = (values: CreateDeviceFormValues) => {
    createMutation.mutate(values);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t('devices.addDevice')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('devices.addDeviceTitle')}</DialogTitle>
          <DialogDescription>
            {t('devices.addDeviceDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.name', 'Name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Front Gate Camera" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cameraId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('devices.selectCameraTitle')}</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t('common.select', 'Select...')} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingCameras ? (
                        <div className="flex items-center justify-center p-2 text-sm text-muted-foreground">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('common.loading', 'Loading...')}
                        </div>
                      ) : cameras.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          {t('common.noData', 'No data')}
                        </div>
                      ) : (
                        cameras.map((camera) => (
                          <SelectItem key={camera.id} value={camera.id}>
                            {camera.name || camera.id}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
