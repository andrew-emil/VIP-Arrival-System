import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { deviceLogin } from '@/services/auth';
import { Role } from '@/services/users/types';
import { useAuthStore } from '@/stores/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

const deviceLoginSchema = z.object({
  deviceId: z.string().min(1, 'Device ID is required'),
  password: z.string().min(8, 'Password is required'), // Assuming min 8 based on other forms
});

type DeviceLoginFormData = z.infer<typeof deviceLoginSchema>;

export function DeviceLoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const [showPass, setShowPass] = useState(false);

  const form = useForm<DeviceLoginFormData>({
    resolver: zodResolver(deviceLoginSchema),
    defaultValues: { deviceId: '', password: '' },
  });

  const loginMutation = useMutation({
    mutationFn: deviceLogin,
    onSuccess: (data) => {
      loginStore({
        id: data.deviceId,
        name: data.name,
        email: `device-${data.deviceId}@vas.internal`,
        role: Role.GATE_GUARD,
      });

      navigate('/gate');
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error', 'An error occurred'));
    }
  });

  const onSubmit = async (formData: DeviceLoginFormData) => {
    loginMutation.mutate(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="deviceId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('login.deviceId', 'Device ID')}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="DEV-12345"
                  {...field}
                />
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
              <FormLabel>{t('common.password')}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPass ? 'text' : 'password'}
                    placeholder="••••••••"
                    {...field}
                    className="pe-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute inset-y-0 end-0 hover:bg-transparent"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.formState.errors.root && (
          <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
        )}
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? '...' : t('login.signIn')}
        </Button>
      </form>
    </Form>
  );
}
