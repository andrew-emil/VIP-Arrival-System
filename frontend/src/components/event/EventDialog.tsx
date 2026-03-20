import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { z } from 'zod';

import { createEvent, updateEvent } from '@/services/events/mutation';
import { EventsQueryKeys } from '@/services/events/queryKeys';
import { IEvent, UpdateEventDto } from '@/services/events/types';

const eventSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  startTime: z.string().min(1, 'Start time is required'),
  endTime: z.string().min(1, 'End time is required'),
  status: z.enum(['draft', 'active', 'completed']),
});

type EventFormValues = z.infer<typeof eventSchema>;

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: IEvent | null;
  onClose: () => void;
}

export function EventDialog({ open, onOpenChange, editing, onClose }: EventDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventSchema),
    defaultValues: { name: '', startTime: '', endTime: '', status: 'draft' },
  });

  useEffect(() => {
    if (open) {
      if (editing) {
        form.reset({
          name: editing.name,
          startTime: new Date(editing.startTime).toISOString().slice(0, 16),
          endTime: new Date(editing.endTime).toISOString().slice(0, 16),
          status: (editing.status as 'draft' | 'active' | 'completed') || 'draft',
        });
      } else {
        form.reset({ name: '', startTime: '', endTime: '', status: 'draft' });
      }
    }
  }, [open, editing, form]);

  const createMutation = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      toast.success(t('events.createSuccess', 'Event created successfully'));
      queryClient.invalidateQueries({ queryKey: EventsQueryKeys.all() });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error', 'An error occurred'));
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateEventDto }) => updateEvent(id, dto),
    onSuccess: () => {
      toast.success(t('events.updateSuccess', 'Event updated successfully'));
      queryClient.invalidateQueries({ queryKey: EventsQueryKeys.all() });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error', 'An error occurred'));
    }
  });

  const onSubmit = (values: EventFormValues) => {
    const payload = {
      ...values,
      startTime: new Date(values.startTime),
      endTime: new Date(values.endTime),
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, dto: payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? t('events.editEvent') : t('events.addEvent')}</DialogTitle>
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
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('events.startTime')}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('events.endTime')}</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.status')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">{t('events.draft')}</SelectItem>
                      <SelectItem value="active">{t('events.active')}</SelectItem>
                      <SelectItem value="completed">{t('events.completed')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>{t('common.cancel')}</Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t('common.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
