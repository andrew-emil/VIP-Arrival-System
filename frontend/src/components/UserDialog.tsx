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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { createUser, updateUser } from '@/services/users/mutation';
import { UsersQueryKeys } from '@/services/users/queryKeys';
import { IUser, Role, CreateUserDto, UpdateUserDto } from '@/services/users/types';

interface UserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: IUser | null;
  onClose: () => void;
}

export function UserDialog({ open, onOpenChange, editing, onClose }: UserDialogProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const userSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    role: z.nativeEnum(Role),
    password: z.string().optional(),
    isActive: z.boolean(),
  }).superRefine((data, ctx) => {
    if (!editing && (!data.password || data.password.length < 6)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: 'Password must be at least 6 characters long',
      });
    }
  });

  type UserFormValues = z.infer<typeof userSchema>;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: '', email: '', role: Role.OPERATOR, password: '', isActive: true },
  });

  useEffect(() => {
    if (open) {
      if (editing) {
        form.reset({
          name: editing.name,
          email: editing.email,
          role: editing.role,
          password: '',
          isActive: editing.isActive,
        });
      } else {
        form.reset({ name: '', email: '', role: Role.OPERATOR, password: '', isActive: true });
      }
    }
  }, [open, editing, form]);

  const createMutation = useMutation({
    mutationFn: (dto: CreateUserDto) => createUser(dto),
    onSuccess: () => {
      toast.success(t('users.createSuccess', 'User created successfully'));
      queryClient.invalidateQueries({ queryKey: UsersQueryKeys.all() });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error', 'An error occurred'));
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateUserDto }) => updateUser(id, dto),
    onSuccess: () => {
      toast.success(t('users.updateSuccess', 'User updated successfully'));
      queryClient.invalidateQueries({ queryKey: UsersQueryKeys.all() });
      onClose();
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error', 'An error occurred'));
    }
  });

  const onSubmit = (values: UserFormValues) => {
    if (editing) {
      const payload: UpdateUserDto = {
        name: values.name,
        email: values.email,
        role: values.role,
        isActive: values.isActive,
      };
      if (values.password) payload.password = values.password;
      
      updateMutation.mutate({ id: editing.id, dto: payload });
    } else {
      createMutation.mutate(values as CreateUserDto);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{editing ? t('users.editUser') : t('users.addUser')}</DialogTitle>
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.email')}</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t('common.password', 'Password')} 
                    {editing && <span className="text-muted-foreground text-xs ml-2">(Leave blank to keep current)</span>}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.role')}</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Role.ADMIN}>{t('users.admin')}</SelectItem>
                      <SelectItem value={Role.OPERATOR}>{t('users.operator')}</SelectItem>
                      <SelectItem value={Role.MANAGER}>{t('users.manager')}</SelectItem>
                      <SelectItem value={Role.GATE_GUARD}>{t('users.gateStaff')}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {editing && (
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('common.status', 'Status')}</FormLabel>
                    <Select onValueChange={(val) => field.onChange(val === 'true')} value={field.value ? 'true' : 'false'}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="true">{t('common.active', 'Active')}</SelectItem>
                        <SelectItem value="false">{t('common.inactive', 'Inactive')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
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
