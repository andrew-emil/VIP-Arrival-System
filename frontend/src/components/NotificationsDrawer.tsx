
import React, { useState } from 'react';
import { NotificationItem } from '../types';
import { X, Bell, Zap, Camera, ShieldAlert, Pin, Check, Clock, Trash2, Info, Search } from 'lucide-react';

interface NotificationsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  language: 'ar' | 'en';
  onMarkRead: (id: string) => void;
  onPin: (id: string) => void;
  onAction: (notif: NotificationItem) => void;
}

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({ isOpen, onClose, notifications, language, onMarkRead, onPin, onAction }) => {
  const [filter, setFilter] = useState<'all' | 'vip' | 'critical'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = notifications.filter(n => {
    const matchesFilter = 
      filter === 'vip' ? n.type.includes('VIP') :
      filter === 'critical' ? n.severity === 'critical' : 
      true;
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      n.titleAr.toLowerCase().includes(searchLower) ||
      n.titleEn.toLowerCase().includes(searchLower) ||
      n.messageAr.toLowerCase().includes(searchLower) ||
      n.messageEn.toLowerCase().includes(searchLower);

    return matchesFilter && matchesSearch;
  });

  const t = {
    title: language === 'ar' ? 'مركز التنبيهات' : 'Notifications Center',
    all: language === 'ar' ? 'الكل' : 'All',
    vip: language === 'ar' ? 'كبار الضيوف' : 'VIP Only',
    critical: language === 'ar' ? 'حرجة' : 'Critical',
    empty: language === 'ar' ? 'لا يوجد تنبيهات حالياً' : 'No notifications yet',
    markAll: language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all as read',
    searchPlaceholder: language === 'ar' ? 'بحث في التنبيهات...' : 'Search notifications...',
  };

  const getIcon = (type: string, severity: string) => {
    if (type.includes('VIP')) return <Zap className={`w-5 h-5 ${severity === 'critical' ? 'text-amber-500' : 'text-blue-500'}`} />;
    if (type === 'CAMERA_OFFLINE') return <Camera className="w-5 h-5 text-rose-500" />;
    return <Info className="w-5 h-5 text-slate-400" />;
  };

  return (
    <div className="fixed inset-0 z-[250] pointer-events-none">
      <div 
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm pointer-events-auto animate-in fade-in"
        onClick={onClose}
      />
      <aside className={`absolute top-0 ${language === 'ar' ? 'left-0' : 'right-0'} bottom-0 w-full max-w-sm bg-white dark:bg-slate-900 border-x border-slate-200 dark:border-slate-800 shadow-2xl pointer-events-auto animate-in ${language === 'ar' ? 'slide-in-from-left' : 'slide-in-from-right'} flex flex-col`}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 space-y-4">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <Bell className="text-indigo-600" size={20} />
               <h3 className="font-black text-lg text-slate-900 dark:text-white tracking-tight">{t.title}</h3>
             </div>
             <button onClick={onClose} className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors"><X size={18} className="text-slate-400" /></button>
          </div>
          
          {/* Search Lens Implementation */}
          <div className="relative group">
            <Search className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors`} />
            <input 
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${language === 'ar' ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-[11px] font-bold focus:outline-none focus:border-indigo-600 dark:text-white transition-all shadow-sm`}
            />
          </div>

          <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
             {(['all', 'vip', 'critical'] as const).map(f => (
               <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`flex-1 py-1.5 text-[10px] font-black uppercase rounded-lg transition-all ${filter === f ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500'}`}
               >
                 {t[f as keyof typeof t]}
               </button>
             ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
          {filtered.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4 opacity-50 py-20 text-center">
              <ShieldAlert size={48} className="animate-pulse" />
              <div className="space-y-1">
                <p className="font-black text-sm">{t.empty}</p>
                {searchTerm && <p className="text-[10px] font-bold">"{searchTerm}"</p>}
              </div>
            </div>
          ) : (
            filtered.sort((a,b) => (a.isPinned ? -1 : 1)).map(n => (
              <div 
                key={n.id}
                onClick={() => { onMarkRead(n.id); onAction(n); }}
                className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${
                  n.isRead ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700' : 'bg-indigo-50/30 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-900/50 shadow-md'
                } ${n.isPinned ? 'ring-1 ring-amber-500/50' : ''}`}
              >
                <div className="flex gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    n.severity === 'critical' ? 'bg-rose-50 dark:bg-rose-900/20' : 'bg-slate-100 dark:bg-slate-800'
                  }`}>
                    {getIcon(n.type, n.severity)}
                  </div>
                  <div className="flex-1 space-y-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                       <h4 className={`text-[11px] font-black truncate ${n.isRead ? 'text-slate-600 dark:text-slate-300' : 'text-slate-900 dark:text-white'}`}>
                         {language === 'ar' ? n.titleAr : n.titleEn}
                       </h4>
                       <span className="text-[9px] text-slate-400 font-bold whitespace-nowrap">
                         {new Date(n.createdAt).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-2">
                       {language === 'ar' ? n.messageAr : n.messageEn}
                    </p>
                  </div>
                </div>

                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button 
                    onClick={(e) => { e.stopPropagation(); onPin(n.id); }}
                    className={`p-1 rounded bg-white dark:bg-slate-800 shadow-sm border ${n.isPinned ? 'text-amber-500 border-amber-200' : 'text-slate-400 border-slate-200 dark:border-slate-700'}`}
                   >
                     <Pin size={12} fill={n.isPinned ? 'currentColor' : 'none'} />
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
};
