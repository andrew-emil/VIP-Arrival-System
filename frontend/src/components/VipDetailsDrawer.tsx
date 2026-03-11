
import React from 'react';
import { VIP, ArrivalEvent, VipActionLog } from '../types';
import { X, User, MapPin, Clock, ShieldCheck, MessageSquare, ArrowLeftRight, CheckCircle2, UserPlus, Info, FileJson } from 'lucide-react';

interface VipDetailsDrawerProps {
  vip?: VIP;
  onClose: () => void;
  onAction: (type: string, details?: string) => void;
  language: 'ar' | 'en';
  logs: VipActionLog[];
  recentReads: ArrivalEvent[];
}

export const VipDetailsDrawer: React.FC<VipDetailsDrawerProps> = ({ vip, onClose, onAction, language, logs, recentReads }) => {
  if (!vip) return null;

  const t = {
    title: language === 'ar' ? 'تفاصيل الضيف' : 'Guest Details',
    status: language === 'ar' ? 'الحالة الحالية' : 'Current Status',
    plate: language === 'ar' ? 'رقم اللوحة' : 'Plate Number',
    actions: language === 'ar' ? 'إجراءات سريعة' : 'Quick Actions',
    confirm: language === 'ar' ? 'تأكيد الوصول النهائي' : 'Confirm Final Arrival',
    escort: language === 'ar' ? 'تعيين مرافق' : 'Assign Escort',
    noShow: language === 'ar' ? 'لم يحضر' : 'Mark No-Show',
    notes: language === 'ar' ? 'الملاحظات' : 'Notes',
    activity: language === 'ar' ? 'سجل النشاط' : 'Activity Log',
    reads: language === 'ar' ? 'آخر الرصدات' : 'Last Detections',
    approaching: language === 'ar' ? 'قادم' : 'Approaching',
    arrived: language === 'ar' ? 'وصل' : 'Arrived',
    cleared: language === 'ar' ? 'داخل الموقع' : 'Inside / Cleared',
    issue: language === 'ar' ? 'مشكلة' : 'Issue',
  };

  const statusMap = {
    'APPROACHING': { label: t.approaching, color: 'bg-blue-500', text: 'text-blue-500' },
    'ARRIVED': { label: t.arrived, color: 'bg-emerald-500', text: 'text-emerald-500' },
    'CLEARED': { label: t.cleared, color: 'bg-indigo-500', text: 'text-indigo-500' },
    'ISSUE': { label: t.issue, color: 'bg-rose-500', text: 'text-rose-500' },
  };

  const currentStatus = statusMap[vip.status];

  return (
    <div className="fixed inset-0 z-[200] pointer-events-none">
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto animate-in fade-in duration-300"
        onClick={onClose}
      />
      <aside className={`absolute top-0 ${language === 'ar' ? 'left-0' : 'right-0'} bottom-0 w-full max-w-md bg-white dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800 shadow-2xl pointer-events-auto animate-in ${language === 'ar' ? 'slide-in-from-left' : 'slide-in-from-right'} duration-500 flex flex-col`}>
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
               <User size={24} />
             </div>
             <div className={language === 'ar' ? 'text-right' : 'text-left'}>
               <h3 className="font-black text-lg text-slate-900 dark:text-white leading-tight">{vip.fullName}</h3>
               <div className="flex items-center gap-2 mt-0.5">
                  <span className={`w-2 h-2 rounded-full ${currentStatus.color}`}></span>
                  <span className={`text-[10px] font-black uppercase tracking-wider ${currentStatus.text}`}>{currentStatus.label}</span>
               </div>
             </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-xl transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Main Card */}
          <div className="bg-slate-50 dark:bg-slate-800/40 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 space-y-4">
             <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.plate}</span>
                <div className="bg-white dark:bg-slate-900 border-2 border-indigo-600 px-3 py-1 rounded-xl shadow-lg">
                   <span className="font-mono font-black text-lg text-slate-900 dark:text-white tracking-tighter">{vip.plateText}</span>
                </div>
             </div>
             <div className="space-y-1">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.notes}</span>
                <p className="text-sm font-bold text-slate-600 dark:text-slate-300 italic">{vip.note}</p>
             </div>
          </div>

          {/* Actions */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.actions}</h4>
            <div className="grid grid-cols-2 gap-3">
               <button 
                onClick={() => onAction('CONFIRM_ARRIVED')}
                className="flex flex-col items-center justify-center p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800 rounded-2xl hover:bg-emerald-100 transition-all gap-2 group"
               >
                 <CheckCircle2 className="text-emerald-600 group-hover:scale-110 transition-transform" />
                 <span className="text-[10px] font-black text-emerald-700 dark:text-emerald-400">{t.confirm}</span>
               </button>
               <button 
                onClick={() => onAction('ASSIGN_ESCORT')}
                className="flex flex-col items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl hover:bg-blue-100 transition-all gap-2 group"
               >
                 <UserPlus className="text-blue-600 group-hover:scale-110 transition-transform" />
                 <span className="text-[10px] font-black text-blue-700 dark:text-blue-400">{t.escort}</span>
               </button>
            </div>
          </div>

          {/* Last Reads */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.reads}</h4>
            <div className="space-y-3">
              {recentReads.length > 0 ? recentReads.map(read => (
                <div key={read.id} className="flex items-center justify-between p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-indigo-500">
                         <MapPin size={16} />
                      </div>
                      <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                         <p className="text-xs font-black text-slate-900 dark:text-white">{read.cameraName}</p>
                         <p className="text-[9px] text-slate-400 font-bold">{read.location}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-xs font-black text-slate-700 dark:text-slate-300">
                        {new Date(read.timestamp).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <span className="text-[9px] text-emerald-500 font-bold">{(read.confidence * 100).toFixed(0)}%</span>
                   </div>
                </div>
              )) : (
                <div className="text-center py-6 text-slate-400 text-[10px] font-black italic">NO_READS_LOGGED</div>
              )}
            </div>
          </div>

          {/* Activity Log */}
          <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.activity}</h4>
            <div className="space-y-4 border-l-2 border-slate-100 dark:border-slate-800 ml-2 pl-6">
              {logs.map(log => (
                <div key={log.id} className="relative">
                  <div className="absolute -left-[31px] top-0 w-3 h-3 rounded-full bg-indigo-500 border-2 border-white dark:border-slate-900"></div>
                  <p className="text-[10px] font-black text-slate-900 dark:text-white leading-none mb-1">{log.actor}</p>
                  <p className="text-[11px] text-slate-500 font-bold">{log.actionType}</p>
                  <p className="text-[9px] text-slate-400 mt-1">{new Date(log.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
