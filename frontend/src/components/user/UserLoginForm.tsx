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
import { login } from '@/services/auth';
import { Role } from '@/services/users/types';
import { useAuthStore } from '@/stores/authStore';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(8, 'Password is required'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function UserLoginForm() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const loginStore = useAuthStore((s) => s.login);
  const [showPass, setShowPass] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      loginStore({
        id: data.id,
        name: data.name,
        email: data.email,
        role: data.role,
      }); // IStoredUser: user login stores id, name, email, role

      const redirectMap: Record<Role, string> = {
        [Role.ADMIN]: '/dashboard',
        [Role.OPERATOR]: '/dashboard',
        [Role.MANAGER]: '/manager/monitor',
        [Role.OBSERVER]: '/manager/monitor',
        [Role.GATE_GUARD]: '/gate',
      };
      navigate(redirectMap[data.role] || '/');
    },
    onError: (error: Error) => {
      toast.error(error?.message || t('common.error', 'An error occurred'));
    }
  });

  const onSubmit = async (formData: LoginFormData) => {
    loginMutation.mutate(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('common.email')}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="admin@vas.com"
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
        <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
          {loginMutation.isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
          {t('login.signIn')}
        </Button>
      </form>
    </Form>
  );
}
