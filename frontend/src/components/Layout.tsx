
import React from 'react';
import { AppSettings } from '../types';
import { VAS_ICONS } from '../config/icons';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  settings: AppSettings;
  unreadNotifsCount: number;
  onBellClick: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, settings, unreadNotifsCount, onBellClick }) => {
  const language = settings.language;
  
  const groups = [
    {
      titleAr: 'العمليات', titleEn: 'Operations',
      items: [
        { id: 'dashboard', labelAr: 'لوحة العمليات', labelEn: 'Operations Room', icon: 'dashboard' },
        { id: 'history', labelAr: 'الخط الزمني', labelEn: 'Timeline', icon: 'history' },
        { id: 'cameras', labelAr: 'الكاميرات', labelEn: 'Cameras', icon: 'cameras' },
      ]
    },
    {
      titleAr: 'الإدارة', titleEn: 'Management',
      items: [
        { id: 'vips', labelAr: 'دليل الضيوف', labelEn: 'VIP Registry', icon: 'vips' },
        { id: 'structure', labelAr: 'المناطق والبوابات', labelEn: 'Site Map', icon: 'zones' },
        { id: 'users', labelAr: 'المستخدمين', labelEn: 'Users & Roles', icon: 'users' },
      ]
    }
  ];

  const activeItemLabel = groups.flatMap(g => g.items).find(i => i.id === activeTab)?.[language === 'ar' ? 'labelAr' : 'labelEn'] || 'VAS COMMAND';

  return (
    <div className={`flex h-screen w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 dark:bg-black text-slate-300 flex flex-col border-l dark:border-l-0 dark:border-r border-slate-800 z-50">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_20px_rgba(79,70,229,0.5)]">V</div>
            <div className={language === 'ar' ? 'text-right' : 'text-left'}>
              <span className="text-xl font-black text-white tracking-tighter leading-none block">VAS COMMAND</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1 block">PLATFORM_v2.5</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto no-scrollbar">
          {groups.map((group, idx) => (
            <div key={idx} className="space-y-2">
              <p className="px-4 text-[9px] font-black text-slate-600 uppercase tracking-widest">{language === 'ar' ? group.titleAr : group.titleEn}</p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = VAS_ICONS[item.icon as keyof typeof VAS_ICONS];
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group relative ${
                        activeTab === item.id 
                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' 
                        : 'hover:bg-slate-800/50 hover:text-white'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} />
                      <span className="font-black text-xs uppercase tracking-widest">{language === 'ar' ? item.labelAr : item.labelEn}</span>
                      {activeTab === item.id && (
                         <div className={`absolute ${language === 'ar' ? '-right-2' : '-left-2'} w-1 h-5 bg-white rounded-full`}></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-6 mt-auto">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all ${activeTab === 'settings' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-500 hover:text-white'}`}
          >
            <VAS_ICONS.settings size={20} />
            <span className="font-black text-xs uppercase tracking-widest">{language === 'ar' ? 'الإعدادات' : 'Settings'}</span>
          </button>
        </div>
      </aside>

      {/* Main Shell */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-10 shrink-0 z-40">
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                <span>VAS</span>
                <VAS_ICONS.arrow size={10} className={language === 'ar' ? 'rotate-180' : ''} />
                <span className="text-slate-900 dark:text-white">{activeItemLabel}</span>
             </div>
          </div>

          <div className="flex items-center gap-6">
             <button onClick={onBellClick} className="relative p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-all">
                <VAS_ICONS.notifications size={20} className="text-slate-500 group-hover:text-indigo-600" />
                {unreadNotifsCount > 0 && (
                   <span className="absolute -top-1 -left-1 w-5 h-5 bg-rose-600 text-white text-[9px] font-black rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center animate-bounce shadow-lg">
                      {unreadNotifsCount}
                   </span>
                )}
             </button>
             <div className={`flex items-center gap-4 ${language === 'ar' ? 'pr-6 border-r' : 'pl-6 border-l'} border-slate-200 dark:border-slate-800`}>
                <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                   <p className="text-[11px] font-black text-slate-900 dark:text-slate-100 leading-none mb-1">عبدالرحمن القحطاني</p>
                   <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest leading-none">Admin Authority</span>
                </div>
                <div className="w-10 h-10 rounded-2xl bg-slate-200 dark:bg-slate-700 overflow-hidden ring-4 ring-slate-100 dark:ring-slate-800">
                   <img src="https://picsum.photos/seed/admin/100/100" alt="Avatar" />
                </div>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-10 bg-slate-50 dark:bg-slate-950">
          {children}
        </div>
      </main>
    </div>
  );
};
