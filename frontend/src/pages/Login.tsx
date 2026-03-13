import LoadingIndicator from '@/components/LoadingIndicator';
import { useGlobalNavigationLoading } from '@/hooks/useGlobalNavigationLoading';
import { useUser } from '@/hooks/useUser';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useActionData, useNavigate, useSubmit } from 'react-router';
import { ModeToggle } from '../components/mode-toggle';
import { VAS_ICONS } from '../config/icons';
import { ILoginResponse } from '../types/auth';
import { CustomErrorResponse } from '../types/error-response.type';

type Inputs = {
    email: string;
    password: string;
}

export function Login() {
    const { t } = useTranslation()
    const submit = useSubmit();
    const { setUser } = useUser()
    const navigate = useNavigate();
    const actionData = useActionData<ILoginResponse | CustomErrorResponse>();
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>()
    const [error, setError] = useState<string | null>(null);
    const isLoading = useGlobalNavigationLoading();

    const onSubmit: SubmitHandler<Inputs> = (data: Inputs, e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault();
        submit(data, { method: 'post' });
    };

    useEffect(() => {
        if (!actionData) return;
        console.log(actionData)
        if ("statusCode" in actionData) {
            setError(actionData.message);
            return
        }

        setUser(actionData)
        navigate('/')
    }, [actionData]);

    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-6 selection:bg-primary/20 selection:text-primary overflow-hidden relative">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />

            <div className="absolute top-6 right-6">
                <ModeToggle />
            </div>

            <div className="w-full max-w-md animate-in fade-in zoom-in duration-700">
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground font-black text-3xl shadow-[0_0_30px_rgba(var(--primary),0.4)] mb-6 transition-transform hover:scale-110">
                        V
                    </div>
                    <h1 className="text-3xl font-black tracking-tighter leading-none mb-2">
                        VAS COMMAND
                    </h1>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em] ml-1">
                        {t('login.title')}
                    </p>
                </div>

                {/* Login Card */}
                <div className="bg-card text-card-foreground rounded-[40px] border border-border shadow-2xl p-10 relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-primary"></div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-6">
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                                    {t('login.email')}
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <VAS_ICONS.mail className="h-5 w-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="email"
                                        {...register('email', {
                                            required: t('login.emailRequired'),
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: t('login.emailInvalid'),
                                            },
                                        })}
                                        className="block w-full pl-14 pr-5 py-4 bg-muted/30 border-2 border-transparent rounded-2xl text-foreground font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                        placeholder={t('login.emailPlaceholder')}
                                    />
                                    {errors.email?.message && (
                                        <p className="text-destructive text-xs mt-2 font-bold px-1 animate-in slide-in-from-top-1">{errors.email?.message}</p>
                                    )}
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">
                                    {t("login.password")}
                                </label>
                                <div className="relative group/input">
                                    <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                                        <VAS_ICONS.lock className="h-5 w-5 text-muted-foreground group-focus-within/input:text-primary transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        {...register('password', {
                                            required: t('login.passwordRequired'),
                                            minLength: {
                                                value: 8,
                                                message: t('login.passwordMinLength'),
                                            }
                                        })}
                                        className="block w-full pl-14 pr-5 py-4 bg-muted/30 border-2 border-transparent rounded-2xl text-foreground font-bold placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                                        placeholder="••••••••"
                                    />
                                </div>
                                {errors.password?.message && (
                                    <p className="text-destructive text-xs mt-2 font-bold px-1 animate-in slide-in-from-top-1">{errors.password?.message}</p>
                                )}
                            </div>
                        </div>

                        {error && (
                            <p className="text-destructive text-xs mt-2 font-bold px-1 animate-in slide-in-from-top-1">{error}</p>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full flex items-center justify-center gap-3 py-5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/30 transition-all active:scale-95 group"
                        >
                            {isLoading ? <LoadingIndicator /> : null}
                            {t('login.submit')}
                            <VAS_ICONS.arrow className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}