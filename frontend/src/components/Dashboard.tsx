
import React, { useState } from 'react';
import { ArrivalEvent, VIP } from '../types';
// Fix: Added MapPin to the lucide-react imports to resolve "Cannot find name 'MapPin'" error
import { Clock, Navigation, Zap, Info, Maximize2, Activity, User, Car, CheckCircle2, AlertTriangle, ChevronRight, MapPin } from 'lucide-react';

interface DashboardProps {
  events: ArrivalEvent[];
  vips: VIP[];
  onSimulate: () => void;
  onVipClick: (id: string) => void;
  language: 'ar' | 'en';
}

export const Dashboard: React.FC<DashboardProps> = ({ events, vips, onSimulate, onVipClick, language }) => {
  const [activeTab, setActiveTab] = useState<'approaching' | 'arrived' | 'cleared' | 'issues'>('approaching');

  const counts = {
    approaching: vips.filter(v => v.status === 'APPROACHING').length,
    arrived: vips.filter(v => v.status === 'ARRIVED').length,
    cleared: vips.filter(v => v.status === 'CLEARED').length,
    issues: vips.filter(v => v.status === 'ISSUE').length,
    totalToday: events.length + 142
  };

  const formatNum = (num: number | string) => num.toLocaleString('en-US');

  const t = {
    title: language === 'ar' ? 'غرفة العمليات الحية' : 'Live Operations Room',
    desc: language === 'ar' ? 'المتابعة الفورية لنقاط الوصول ومعالجة بيانات LPR' : 'Real-time monitoring of access points and LPR data',
    simulate: language === 'ar' ? 'محاكاة رصد' : 'Simulate Capture',
    kpis: {
      total: language === 'ar' ? 'إجمالي الرصد' : 'Total Reads',
      approaching: language === 'ar' ? 'مركبات قادمة' : 'Approaching',
      arrived: language === 'ar' ? 'وصلوا حديثاً' : 'Arrived Now',
      issues: language === 'ar' ? 'مشاكل تقنية' : 'System Issues',
    },
    tabs: {
      approaching: language === 'ar' ? 'قادمون' : 'Approaching',
      arrived: language === 'ar' ? 'وصلوا' : 'Arrived',
      cleared: language === 'ar' ? 'داخل الموقع' : 'Inside',
      issues: language === 'ar' ? 'مشاكل' : 'Issues',
    },
    noData: language === 'ar' ? 'لا توجد بيانات للعرض حالياً' : 'No data available to display',
    accuracy: language === 'ar' ? 'دقة' : 'Acc.',
  };

  const filteredVips = vips.filter(v => v.status === activeTab.toUpperCase());

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24 transition-all">
      {/* KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { label: t.kpis.total, val: counts.totalToday, icon: Car, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
          { label: t.kpis.approaching, val: counts.approaching, icon: Navigation, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: t.kpis.arrived, val: counts.arrived, icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { label: t.kpis.issues, val: counts.issues, icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
        ].map((kpi, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl flex items-center gap-5 transition-transform hover:scale-[1.02]">
            <div className={`w-14 h-14 ${kpi.bg} ${kpi.color} rounded-2xl flex items-center justify-center shadow-inner`}>
              <kpi.icon size={28} />
            </div>
            <div className={language === 'ar' ? 'text-right' : 'text-left'}>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">{formatNum(kpi.val)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Container */}
      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden min-h-[600px] flex flex-col">
         {/* Tabs Header */}
         <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl w-full md:w-auto overflow-x-auto no-scrollbar">
               {(['approaching', 'arrived', 'cleared', 'issues'] as const).map(tab => (
                 <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeTab === tab 
                    ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xl scale-[1.05]' 
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                 >
                   {t.tabs[tab]}
                   <span className="ml-2 opacity-50">({counts[tab]})</span>
                 </button>
               ))}
            </div>
            <button onClick={onSimulate} className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black shadow-lg transition-all active:scale-95">
               <Zap size={16} />
               {t.simulate}
            </button>
         </div>

         {/* Content Grid */}
         <div className="flex-1 p-8">
            {filteredVips.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-300 py-32 space-y-4">
                 <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center border-4 border-dashed border-slate-100 dark:border-slate-700">
                    <Car size={40} className="opacity-20" />
                 </div>
                 <p className="font-black text-sm uppercase tracking-widest opacity-50">{t.noData}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredVips.map(vip => {
                  const lastEvent = events.find(e => e.vipInfo?.id === vip.id);
                  return (
                    <div 
                      key={vip.id} 
                      onClick={() => onVipClick(vip.id)}
                      className="group bg-slate-50 dark:bg-slate-800/40 border-2 border-slate-100 dark:border-slate-800 rounded-[32px] p-6 hover:border-indigo-500 transition-all cursor-pointer hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-10 h-10 bg-white dark:bg-slate-900 rounded-xl flex items-center justify-center text-indigo-500 shadow-md">
                          <User size={20} />
                        </div>
                        <div className="bg-white dark:bg-slate-900 border-2 border-indigo-600 px-3 py-1 rounded-xl shadow-lg">
                           <span className="font-mono font-black text-base text-slate-900 dark:text-white">{vip.plateText}</span>
                        </div>
                      </div>
                      <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                        <h4 className="font-black text-slate-900 dark:text-white text-lg mb-1">{vip.fullName}</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{vip.priority} VIP</p>
                      </div>
                      
                      {lastEvent ? (
                        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                           <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-slate-400" />
                              <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                 <p className="text-[10px] font-black text-slate-900 dark:text-white">{lastEvent.cameraName}</p>
                                 <p className="text-[9px] text-slate-400 font-bold leading-none">{lastEvent.location}</p>
                              </div>
                           </div>
                           <div className="flex items-center gap-2">
                              <Clock className="w-3 h-3 text-slate-400" />
                              <span className="text-[10px] font-black text-slate-500">
                                {new Date(lastEvent.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                              </span>
                           </div>
                        </div>
                      ) : (
                        <div className="mt-6 h-[46px] rounded-xl bg-white/50 dark:bg-slate-900/50 border-2 border-dashed border-slate-100 dark:border-slate-700 flex items-center justify-center">
                           <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">NO_RECENT_READS</span>
                        </div>
                      )}
                      
                      {/* Interactive indicator */}
                      <div className={`absolute bottom-6 ${language === 'ar' ? 'left-6' : 'right-6'} opacity-0 group-hover:opacity-100 transition-opacity`}>
                        <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg">
                           <ChevronRight size={16} className={language === 'ar' ? 'rotate-180' : ''} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
         </div>
      </div>
    </div>
  );
};
