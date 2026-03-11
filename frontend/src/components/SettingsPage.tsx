
import React, { useState } from 'react';
import { AppSettings } from '../types';
import { VAS_ICONS } from '../config/icons';

interface SettingsPageProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  language: 'ar' | 'en';
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ settings, setSettings, language }) => {
  const [activeSection, setActiveSection] = useState('general');

  const update = (key: keyof AppSettings, val: any) => setSettings({ ...settings, [key]: val });

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{language === 'ar' ? 'إعدادات النظام' : 'System Settings'}</h1>
      
      <div className="flex flex-col lg:flex-row gap-12">
         <aside className="w-72 space-y-2 shrink-0">
            {['general', 'appearance', 'notifications', 'security'].map(s => (
              <button 
                key={s}
                onClick={() => setActiveSection(s)}
                className={`w-full flex items-center justify-between px-6 py-5 rounded-[24px] transition-all ${activeSection === s ? 'bg-indigo-600 text-white shadow-xl translate-x-1' : 'bg-white dark:bg-slate-900 text-slate-500 border border-slate-100 dark:border-slate-800'}`}
              >
                <span className="font-black text-xs uppercase tracking-widest">{s}</span>
                <VAS_ICONS.arrow size={14} className={language === 'ar' ? 'rotate-180' : ''} />
              </button>
            ))}
         </aside>

         <div className="flex-1 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-2xl p-10 space-y-10">
            {activeSection === 'general' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 dark:border-slate-700">
                      <VAS_ICONS.language size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white">{language === 'ar' ? 'اللغة' : 'Language'}</h4>
                      <p className="text-xs text-slate-400 font-bold">{language === 'ar' ? 'لغة واجهة النظام' : 'System interface language'}</p>
                    </div>
                  </div>
                  <div className="flex p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
                    <button onClick={() => update('language', 'ar')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${settings.language === 'ar' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>العربية</button>
                    <button onClick={() => update('language', 'en')} className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${settings.language === 'en' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>English</button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 dark:border-slate-700">
                      <VAS_ICONS.timezone size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white">{language === 'ar' ? 'المنطقة الزمنية' : 'Timezone'}</h4>
                      <p className="text-xs text-slate-400 font-bold">Standard UTC Offset</p>
                    </div>
                  </div>
                  <select 
                    value={settings.timezone}
                    onChange={(e) => update('timezone', e.target.value)}
                    className="p-3 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-xs font-black text-slate-700 dark:text-slate-200 outline-none"
                  >
                    <option value="Asia/Riyadh">Asia/Riyadh (UTC+3)</option>
                    <option value="Europe/London">Europe/London (UTC+0)</option>
                    <option value="America/New_York">America/New_York (UTC-5)</option>
                  </select>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 dark:border-slate-700">
                      {settings.theme === 'dark' ? <VAS_ICONS.moon size={24} /> : <VAS_ICONS.sun size={24} />}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white">{language === 'ar' ? 'السمة' : 'Theme'}</h4>
                      <p className="text-xs text-slate-400 font-bold">Dark / Light Control</p>
                    </div>
                  </div>
                  <div className="flex p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
                    <button onClick={() => update('theme', 'light')} className={`p-3 rounded-xl transition-all ${settings.theme === 'light' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}><VAS_ICONS.sun size={18} /></button>
                    <button onClick={() => update('theme', 'dark')} className={`p-3 rounded-xl transition-all ${settings.theme === 'dark' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}><VAS_ICONS.moon size={18} /></button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100 dark:border-slate-700">
                      <VAS_ICONS.density size={24} />
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white">{language === 'ar' ? 'كثافة الواجهة' : 'UI Density'}</h4>
                      <p className="text-xs text-slate-400 font-bold">Comfortable vs Compact</p>
                    </div>
                  </div>
                  <div className="flex p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-inner">
                    <button onClick={() => update('uiDensity', 'comfortable')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${settings.uiDensity === 'comfortable' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>Comfort</button>
                    <button onClick={() => update('uiDensity', 'compact')} className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase transition-all ${settings.uiDensity === 'compact' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500'}`}>Compact</button>
                  </div>
                </div>
              </div>
            )}
            
            <div className="pt-10 flex justify-end">
               <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl active:scale-95 border-b-4 border-indigo-800">
                  <VAS_ICONS.success size={20} />
                  {language === 'ar' ? 'حفظ التغييرات' : 'Apply Changes'}
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};
