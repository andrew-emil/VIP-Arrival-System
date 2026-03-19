import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { createVip, updateVip } from '@/services/vip/mutation';
import { VipQueryKeys } from '@/services/vip/queryKeys';
import { IVip } from '@/services/vip/types';
import { ProtocolLevel } from '@/types';

interface VipsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: IVip | null;
  onClose: () => void;
}

const vipsSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  company: z.string(),
  protocolLevel: z.enum(['A', 'B', 'C', 'D']),
  plateNumbers: z.string(),
  notes: z.string(),
});

type VipsFormValues = z.infer<typeof vipsSchema>;

export function VipsDialog({ open, onOpenChange, editing, onClose }: VipsDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const form = useForm<VipsFormValues>({
    resolver: zodResolver(vipsSchema),
    defaultValues: {
      name: '',
      company: '',
      protocolLevel: 'B',
      plateNumbers: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (open) {
      if (editing) {
        form.reset({
          name: editing.name,
          company: editing.company || '',
          protocolLevel: (editing.protocolLevel as ProtocolLevel) || 'B',
          plateNumbers: (editing as any).plateNumbers?.join(', ') || (editing as any).plate || '',
          notes: editing.notes || '',
        });
      } else {
        form.reset({
          name: '',
          company: '',
          protocolLevel: 'B',
          plateNumbers: '',
          notes: '',
        });
      }
    }
  }, [open, editing, form]);

  const createMutation = useMutation({
    // We cast to any because the CreateVipDto in types.ts is minimal, 
    // but the actual API likely supports more fields.
    mutationFn: (dto: any) => createVip(dto),
    onSuccess: () => {
      toast.success(t('vips.createSuccess', 'VIP created successfully'));
      queryClient.invalidateQueries({ queryKey: VipQueryKeys.all() });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error', 'An error occurred'));
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: any }) => updateVip(id, dto),
    onSuccess: () => {
      toast.success(t('vips.updateSuccess', 'VIP updated successfully'));
      queryClient.invalidateQueries({ queryKey: VipQueryKeys.all() });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error', 'An error occurred'));
    }
  });

  const onSubmit = (values: VipsFormValues) => {
    const plates = values.plateNumbers.split(',').map((p) => p.trim()).filter(Boolean);
    
    // Mapping form values to what the API expects (or what was used in the store)
    const payload = {
      ...values,
      plateNumbers: plates,
      // The API might expect 'plate' instead of 'plateNumbers' as a singular string 
      // based on CreateVipDto. We provide both if needed, OR just stick to what was there.
      plate: plates[0] || '', 
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
          <DialogTitle>{editing ? t('vips.editVip') : t('vips.addVip')}</DialogTitle>
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
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.company')}</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="protocolLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('vips.protocolLevel')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {['A', 'B', 'C', 'D'].map((l) => (
                        <SelectItem key={l} value={l}>{l}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plateNumbers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('vips.plateNumbers')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="ABC 1234, DEF 5678" className="font-mono" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.notes')}</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
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
