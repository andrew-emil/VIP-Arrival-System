
import React, { useState } from 'react';
import { ArrivalEvent } from '../types';
import { Calendar, Download, Search, Code, X, Filter, Navigation, Zap, Clock, Info, ChevronLeft } from 'lucide-react';

interface HistoryProps {
  events: ArrivalEvent[];
  onEventClick: (event: ArrivalEvent) => void;
  language: 'ar' | 'en';
}

export const History: React.FC<HistoryProps> = ({ events, onEventClick, language }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [vipOnly, setVipOnly] = useState(false);
  const [selectedRaw, setSelectedRaw] = useState<ArrivalEvent | null>(null);

  const filtered = events.filter(e => {
    const matchesSearch = e.plateText.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (e.vipInfo?.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesVip = !vipOnly || e.isVip;
    return matchesSearch && matchesVip;
  });

  const t = {
    title: language === 'ar' ? 'الخط الزمني للأحداث' : 'Event Timeline',
    search: language === 'ar' ? 'البحث باللوحة أو الاسم...' : 'Search plate or name...',
    vipOnly: language === 'ar' ? 'VIP فقط' : 'VIP Only',
    export: language === 'ar' ? 'تصدير السجل' : 'Export Logs',
    details: language === 'ar' ? 'بيانات الخام' : 'Raw Data',
    approaching: language === 'ar' ? 'اقتراب من السور' : 'Approaching Perimeter',
    arrived: language === 'ar' ? 'وصول مؤكد' : 'Confirmed Arrival',
    accuracy: language === 'ar' ? 'دقة الرصد' : 'Confidence',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-24 transition-colors">
      <div className={`flex flex-col md:flex-row justify-between items-center gap-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mt-1">
            {language === 'ar' ? `مراجعة ${events.length} حركة رصد مسجلة` : `Reviewing ${events.length} recorded movements`}
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-xs font-black shadow-sm">
             <Download size={16} />
             {t.export}
           </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col md:flex-row gap-6">
         <div className="relative flex-1">
            <Search className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
            <input 
              type="text" 
              placeholder={t.search}
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className={`w-full ${language === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} py-3.5 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black focus:outline-none focus:border-indigo-600 transition-all text-right`}
            />
         </div>
         <div className="flex items-center gap-4 px-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700">
            <span className="text-xs font-black text-slate-500 uppercase">{t.vipOnly}</span>
            <button 
              onClick={() => setVipOnly(!vipOnly)}
              className={`w-12 h-6 rounded-full transition-all relative ${vipOnly ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-600'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${vipOnly ? (language === 'ar' ? 'right-7' : 'left-7') : (language === 'ar' ? 'right-1' : 'left-1')}`}></div>
            </button>
         </div>
      </div>

      {/* Timeline */}
      <div className="relative space-y-12 before:absolute before:inset-y-0 before:left-8 before:w-1 before:bg-slate-100 dark:before:bg-slate-800 before:rounded-full ml-4">
        {filtered.map((event, idx) => (
          <div key={event.id} className="relative pl-16 group animate-in fade-in slide-in-from-left-4" style={{ animationDelay: `${idx * 50}ms` }}>
            {/* Timeline Dot */}
            <div className={`absolute left-5 top-2 w-6 h-6 rounded-full border-4 border-white dark:border-slate-950 z-10 transition-all group-hover:scale-125 ${
              event.isVip ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.6)]' : 'bg-indigo-500'
            }`}></div>
            
            <div className={`bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] p-6 shadow-lg transition-all hover:shadow-2xl hover:border-indigo-400 group flex flex-col md:flex-row gap-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
               <div className="w-full md:w-32 shrink-0">
                  <div className="flex flex-col">
                     <span className="text-2xl font-black text-slate-900 dark:text-white tabular-nums">
                       {new Date(event.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                     </span>
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">TODAY_ACCESS</span>
                  </div>
               </div>
               
               <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                     <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${event.isVip ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                           {event.isVip ? <Zap size={20} fill="currentColor" /> : <Car size={20} />}
                        </div>
                        <div>
                           <div className="flex items-center gap-2">
                              <h4 className="font-black text-slate-900 dark:text-white">{event.isVip ? event.vipInfo?.fullName : 'ضيف مجهول'}</h4>
                              {event.isVip && (
                                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter">VIP_PRIORITY</span>
                              )}
                           </div>
                           <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{event.status === 'APPROACHING' ? t.approaching : t.arrived}</p>
                        </div>
                     </div>
                     <div className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 px-4 py-2 rounded-2xl shadow-sm">
                        <span className="font-mono font-black text-lg text-slate-800 dark:text-white tracking-tighter leading-none">{event.plateText}</span>
                     </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-4 mt-2">
                     <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500">
                        <div className="flex items-center gap-1.5">
                           <Navigation size={14} className="text-indigo-500" />
                           {event.cameraName}
                        </div>
                        <div className="flex items-center gap-1.5">
                           <Info size={14} className="text-emerald-500" />
                           {t.accuracy}: {(event.confidence * 100).toFixed(0)}%
                        </div>
                     </div>
                     <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSelectedRaw(event)}
                          className="flex items-center gap-1.5 text-[10px] font-black text-indigo-600 hover:text-white hover:bg-indigo-600 px-4 py-1.5 rounded-xl transition-all border border-indigo-100 dark:border-indigo-900/50"
                        >
                          <Code size={14} />
                          {t.details}
                        </button>
                        {event.isVip && (
                          <button 
                            onClick={() => onEventClick(event)}
                            className="text-[10px] font-black text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                          >
                             متابعة الضيف
                          </button>
                        )}
                     </div>
                  </div>
               </div>
            </div>
          </div>
        ))}
      </div>

      {/* Raw Payload Modal */}
      {selectedRaw && (
        <div className="fixed inset-0 z-[300] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-6">
           <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-2xl shadow-2xl border border-white/20 overflow-hidden animate-in zoom-in-95">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Code className="text-indigo-600" />
                    <h3 className="font-black text-xl dark:text-white">Audit Log: RAW_PAYLOAD</h3>
                 </div>
                 <button onClick={() => setSelectedRaw(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"><X /></button>
              </div>
              <div className="p-8 bg-slate-950" dir="ltr">
                 <pre className="text-indigo-300 text-xs font-mono overflow-auto max-h-[400px]">
                   {JSON.stringify(selectedRaw.rawPayload || selectedRaw, null, 2)}
                 </pre>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const Car = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 13.1V16c0 .6.4 1 1 1h2" />
    <circle cx="7" cy="17" r="2" />
    <path d="M9 17h6" />
    <circle cx="17" cy="17" r="2" />
  </svg>
);
