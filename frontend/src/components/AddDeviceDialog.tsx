import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDevice, DevicesQueryKeys } from '@/services/devices';
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
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';

const createDeviceSchema = z.object({
  name: z.string().min(1, 'Device name is required'),
  cameraId: z.string().min(1, 'Camera ID is required'),
});

type CreateDeviceFormValues = z.infer<typeof createDeviceSchema>;

export function AddDeviceDialog() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<CreateDeviceFormValues>({
    resolver: zodResolver(createDeviceSchema),
    defaultValues: {
      name: '',
      cameraId: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: createDevice,
    onSuccess: (data) => {
      toast.success(t('cameras.createSuccess'));
      if (data?.temporaryPassword) {
        toast.info(t('cameras.newPassword', { password: data.temporaryPassword }), {
          duration: 10000,
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
          {t('cameras.addCamera')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('cameras.addCameraTitle')}</DialogTitle>
          <DialogDescription>
            {t('cameras.addCameraDescription')}
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
                  <FormLabel>{t('cameras.cameraIdTitle')}</FormLabel>
                  <FormControl>
                    <Input placeholder="CAM-123" {...field} />
                  </FormControl>
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
                {t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
