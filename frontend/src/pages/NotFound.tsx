import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

export function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-6 selection:bg-primary/20 selection:text-primary overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />

      <div className="max-w-md w-full text-center space-y-8 relative z-10">
        <div className="relative inline-block">
          <h1 className="text-[120px] font-black text-primary/10 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center backdrop-blur-sm border border-primary/20 shadow-2xl shadow-primary/20 rotate-12 transition-transform hover:rotate-0 duration-500">
              <AlertCircle className="w-10 h-10 text-primary" />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl font-black tracking-tight uppercase">
            {t('notFound.title')}
          </h2>
          <p className="text-muted-foreground font-medium text-sm leading-relaxed px-4">
            {t('notFound.description')}
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="px-8 py-4 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-primary/30 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            {t('notFound.goHome')}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 border border-border/50 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('notFound.goBack')}
          </button>
        </div>
      </div>

      <div className="absolute bottom-8 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 flex items-center gap-2">
        <span className="w-8 h-[1px] bg-border/20" />
        VAS — VIP ARRIVAL SYSTEM
        <span className="w-8 h-[1px] bg-border/20" />
      </div>
    </div>
  );
}

export default NotFound;
