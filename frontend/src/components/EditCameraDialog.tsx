import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateCamera, CameraQueryKeys, ICamera } from '@/services/camera';
import { useEventStore } from '@/stores/eventStore';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const updateCameraSchema = z.object({
  name: z.string().min(1, 'Camera name is required'),
  location: z.string().optional(),
  ip: z.string().min(1, 'IP address is required'),
  role: z.enum(['APPROACH', 'GATE'] as const, { message: 'Role is required' }),
  eventId: z.string().min(1, 'Event ID is required'),
});

type UpdateCameraFormValues = z.infer<typeof updateCameraSchema>;

interface EditCameraDialogProps {
  camera: ICamera | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditCameraDialog({ camera, isOpen, onOpenChange }: EditCameraDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const events = useEventStore((s) => s.events);

  const form = useForm<UpdateCameraFormValues>({
    resolver: zodResolver(updateCameraSchema),
    defaultValues: {
      name: '',
      location: '',
      ip: '',
      role: 'APPROACH',
      eventId: '',
    },
  });

  useEffect(() => {
    if (camera && isOpen) {
      form.reset({
        name: camera.name,
        location: camera.location || '',
        ip: camera.ip,
        role: camera.role,
        eventId: camera.eventId,
      });
    }
  }, [camera, isOpen, form]);

  const updateMutation = useMutation({
    mutationFn: (values: UpdateCameraFormValues) => updateCamera(camera!.id, { id: camera!.id, ...values }),
    onSuccess: () => {
      toast.success(t('cameras.updateSuccess'));
      queryClient.invalidateQueries({ queryKey: CameraQueryKeys.all() });
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error', 'An error occurred'));
    }
  });

  const onSubmit = (values: UpdateCameraFormValues) => {
    if (!camera) return;
    updateMutation.mutate(values);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('cameras.editCameraTitle')}</DialogTitle>
          <DialogDescription>
            {t('cameras.editCameraDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.name')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Main Entrance Camera" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ip"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('cameras.ipAddress')}</FormLabel>
                  <FormControl>
                    <Input placeholder="192.168.1.100" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('cameras.location')}</FormLabel>
                  <FormControl>
                    <Input placeholder="Front Gate 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('cameras.cameraRole')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('cameras.selectRole')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="APPROACH">{t('cameras.approach')}</SelectItem>
                        <SelectItem value="GATE">{t('cameras.gate')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="eventId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('events.selectEvent')}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('events.selectEvent')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {events.map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
