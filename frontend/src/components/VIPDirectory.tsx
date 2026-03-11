
import React, { useState, useRef } from 'react';
import { VIP } from '../types';
import { Search, Trash2, Filter, MoreVertical, CreditCard, AlertCircle, CheckCircle2, Loader2, UserPlus, ShieldAlert, ChevronDown, ChevronRight, ChevronLeft, User, Car, Star, X, Download, FileSpreadsheet, Layers, Smartphone, Plus, Minus } from 'lucide-react';

interface VIPDirectoryProps {
  vips: VIP[];
  onAddVip: (vip: VIP) => void;
  onDeleteVip: (id: string) => void;
  language: 'ar' | 'en';
}

interface DelegationMember {
  fullName: string;
  plateText: string;
  carType: string;
  color: string;
  note: string;
}

export const VIPDirectory: React.FC<VIPDirectoryProps> = ({ vips, onAddVip, onDeleteVip, language }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showBulkMenu, setShowBulkMenu] = useState(false);
  const [showDelegationModal, setShowDelegationModal] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string, title: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [delegationMembers, setDelegationMembers] = useState<DelegationMember[]>([
    { fullName: '', plateText: '', carType: '', color: '', note: '' }
  ]);

  const [newVip, setNewVip] = useState({ 
    plateText: '', 
    fullName: '', 
    priority: 'Gold' as VIP['priority'], 
    note: '' 
  });

  const formatNum = (num: number | string) => num.toLocaleString('en-US');

  const filteredVips = vips.filter(v => {
    const matchesSearch = v.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         v.plateText.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = selectedPriority === 'all' || v.priority === selectedPriority;
    return matchesSearch && matchesPriority;
  });

  const t = {
    title: language === 'ar' ? 'دليل كبار الشخصيات' : 'VIP Directory',
    count: language === 'ar' ? `إدارة ${formatNum(vips.length)} ملف تعريفي` : `Managing ${formatNum(vips.length)} profiles`,
    addVip: language === 'ar' ? 'إضافة ضيف' : 'Add VIP',
    bulkAdd: language === 'ar' ? 'إضافة ضيوف (متعدد)' : 'Bulk Add Guests',
    export: language === 'ar' ? 'تصدير إكسل' : 'Export Excel',
    search: language === 'ar' ? 'ابحث بالاسم، اللوحة...' : 'Search by name, plate...',
    allCats: language === 'ar' ? 'كل الفئات' : 'All Tiers',
    gold: language === 'ar' ? 'ذهبي' : 'Gold',
    platinum: language === 'ar' ? 'بلاتيني' : 'Platinum',
    diamond: language === 'ar' ? 'ماسي' : 'Diamond',
    plate: language === 'ar' ? 'رقم اللوحة' : 'Plate Number',
    name: language === 'ar' ? 'اسم الضيف' : 'Guest Name',
    tier: language === 'ar' ? 'الفئة' : 'Tier',
    status: language === 'ar' ? 'الحالة' : 'Status',
    actions: language === 'ar' ? 'الإجراءات' : 'Actions',
    next: language === 'ar' ? 'التالي' : 'Next',
    back: language === 'ar' ? 'السابق' : 'Back',
    save: language === 'ar' ? 'حفظ' : 'Save',
    cancel: language === 'ar' ? 'إلغاء' : 'Cancel',
    fromExcel: language === 'ar' ? 'إضافة من إكسل' : 'Import from Excel',
    fromDevice: language === 'ar' ? 'إضافة من الجهاز' : 'Import from Device',
    multiSystem: language === 'ar' ? 'إضافات متعددة (نظام الوفود)' : 'Multiple System Additions',
    delegationTitle: language === 'ar' ? 'إدارة الوفد والمجموعات' : 'Delegation Management',
    addMember: language === 'ar' ? 'إضافة ضيف للوفد' : 'Add Delegation Member',
    carType: language === 'ar' ? 'نوع السيارة' : 'Car Type',
    carColor: language === 'ar' ? 'اللون / المواصفات' : 'Color / Specs',
    saveDelegation: language === 'ar' ? 'تسجيل الوفد بالكامل' : 'Register Full Delegation',
    step1: language === 'ar' ? 'الهوية' : 'Identity',
    step2: language === 'ar' ? 'المركبة' : 'Vehicle',
    step3: language === 'ar' ? 'الفئة' : 'Tier',
    fullName: language === 'ar' ? 'الاسم الكامل' : 'Full Name',
    noteLabel: language === 'ar' ? 'ملاحظات' : 'Notes',
    plateLabel: language === 'ar' ? 'اللوحة' : 'Plate',
  };

  const showFeedback = (type: 'success' | 'error', title: string, message: string) => {
    setFeedback({ type, title, message });
    setTimeout(() => setFeedback(null), 5000);
  };

  const handleExportExcel = () => {
    setIsExporting(true);
    try {
      const headers = language === 'ar' ? 'الاسم الكامل,رقم اللوحة,الفئة,الملاحظات,الحالة' : 'Full Name,Plate Text,Priority,Note,Status';
      const rows = filteredVips.map(v => `"${v.fullName}","${v.plateText}","${v.priority}","${v.note.replace(/"/g, '""')}","${v.status}"`);
      const csvContent = "\ufeff" + [headers, ...rows].join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `VIP_Directory_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showFeedback('success', language === 'ar' ? 'تم التصدير' : 'Export Complete', language === 'ar' ? 'تم تحميل الملف بنجاح' : 'File downloaded');
    } catch (err) {
      showFeedback('error', 'Error', 'Failed to export');
    } finally {
      setTimeout(() => setIsExporting(false), 500);
    }
  };

  const addDelegationRow = () => {
    setDelegationMembers([...delegationMembers, { fullName: '', plateText: '', carType: '', color: '', note: '' }]);
  };

  const removeDelegationRow = (index: number) => {
    if (delegationMembers.length > 1) {
      setDelegationMembers(delegationMembers.filter((_, i) => i !== index));
    }
  };

  const updateMember = (index: number, field: keyof DelegationMember, value: string) => {
    const updated = [...delegationMembers];
    updated[index][field] = value;
    setDelegationMembers(updated);
  };

  const handleSaveDelegation = async () => {
    const validMembers = delegationMembers.filter(m => m.fullName && m.plateText);
    if (validMembers.length === 0) {
      showFeedback('error', language === 'ar' ? 'تنبيه' : 'Warning', language === 'ar' ? 'يجب إدخال بيانات ضيف واحد على الأقل' : 'Enter at least one member');
      return;
    }

    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      validMembers.forEach(m => {
        onAddVip({
          id: `v-${Math.random().toString(36).substr(2, 9)}`,
          fullName: m.fullName,
          plateText: m.plateText,
          priority: 'Gold',
          note: `${m.carType} - ${m.color} | ${m.note}`,
          status: 'CLEARED'
        });
      });
      showFeedback('success', language === 'ar' ? 'تم بنجاح' : 'Success', language === 'ar' ? `تم تسجيل ${validMembers.length} ضيفاً` : `${validMembers.length} members registered`);
      setShowDelegationModal(false);
      setDelegationMembers([{ fullName: '', plateText: '', carType: '', color: '', note: '' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveVip = async () => {
    if (!newVip.fullName || !newVip.plateText) {
      showFeedback('error', language === 'ar' ? 'بيانات ناقصة' : 'Missing Data', language === 'ar' ? 'يرجى إكمال الحقول الإلزامية' : 'Fill required fields');
      return;
    }
    setIsProcessing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      onAddVip({ ...newVip, id: `v-${Date.now()}`, status: 'CLEARED' });
      showFeedback('success', language === 'ar' ? 'تمت الإضافة' : 'Added', language === 'ar' ? `تم تسجيل الضيف بنجاح` : `VIP registered`);
      setShowAddForm(false);
      setNewVip({ plateText: '', fullName: '', priority: 'Gold', note: '' });
      setFormStep(1);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string, plate: string, name: string) => {
    if (!window.confirm(language === 'ar' ? `حذف ${name}؟` : `Delete ${name}?`)) return;
    setDeletingId(id);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      onDeleteVip(id);
      showFeedback('success', language === 'ar' ? 'تم الحذف' : 'Deleted', '');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 transition-colors pb-24 relative">
      {feedback && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[1000] flex items-start gap-4 px-6 py-5 rounded-[24px] shadow-2xl border-2 animate-in slide-in-from-top-12 duration-500 w-full max-w-lg ${feedback.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-rose-600 border-rose-500 text-white'}`}>
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            {feedback.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <h4 className="font-black text-base leading-none mb-1">{feedback.title}</h4>
            <p className="text-sm opacity-90 font-medium">{feedback.message}</p>
          </div>
        </div>
      )}

      <div className={`flex flex-col md:flex-row justify-between items-center mb-10 gap-6 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
        <div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t.title}</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-bold mt-1">{t.count}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
           <button onClick={handleExportExcel} disabled={isExporting} className="flex items-center gap-3 px-6 py-3.5 bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 border-2 border-emerald-100 dark:border-emerald-900/50 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-emerald-50 transition-all">
              {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <FileSpreadsheet className="w-5 h-5" />}
              {t.export}
           </button>
           
           <div className="relative">
              <button 
                onClick={() => setShowBulkMenu(!showBulkMenu)}
                className="flex items-center gap-3 px-6 py-3.5 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 border-2 border-indigo-100 dark:border-indigo-800 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-100 transition-all"
              >
                <Layers className="w-5 h-5" />
                {t.bulkAdd}
                <ChevronDown className={`w-4 h-4 transition-transform ${showBulkMenu ? 'rotate-180' : ''}`} />
              </button>
              
              {showBulkMenu && (
                <div className={`absolute top-full mt-2 ${language === 'ar' ? 'right-0' : 'left-0'} w-72 bg-white dark:bg-slate-900 rounded-[24px] shadow-2xl border border-slate-100 dark:border-slate-800 p-2 z-[400] animate-in zoom-in-95`}>
                   <button onClick={() => { setShowBulkMenu(false); fileInputRef.current?.click(); }} className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all group">
                      <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><FileSpreadsheet size={20} /></div>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200">{t.fromExcel}</span>
                   </button>
                   <button onClick={() => { setShowBulkMenu(false); fileInputRef.current?.click(); }} className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all group">
                      <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><Smartphone size={20} /></div>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200">{t.fromDevice}</span>
                   </button>
                   <button onClick={() => { setShowBulkMenu(false); setShowDelegationModal(true); }} className="w-full flex items-center gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all group">
                      <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><Layers size={20} /></div>
                      <span className="text-xs font-black text-slate-700 dark:text-slate-200">{t.multiSystem}</span>
                   </button>
                </div>
              )}
           </div>

           <button onClick={() => { setFormStep(1); setShowAddForm(true); }} className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl border-b-4 border-indigo-800">
             <UserPlus className="w-5 h-5" />
             {t.addVip}
           </button>
        </div>
      </div>

      <input type="file" ref={fileInputRef} className="hidden" accept=".csv,.xlsx" onChange={() => showFeedback('success', 'File Received', 'Processing data...')} />

      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden mb-12">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30 flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400`} />
            <input type="text" placeholder={t.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className={`w-full ${language === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[20px] text-sm font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all dark:text-white`} />
          </div>
          <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} className="py-3.5 px-6 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-[20px] text-sm font-black text-slate-600 dark:text-slate-300 outline-none">
            <option value="all">{t.allCats}</option>
            <option value="Gold">{t.gold}</option>
            <option value="Platinum">{t.platinum}</option>
            <option value="Diamond">{t.diamond}</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className={`w-full ${language === 'ar' ? 'text-right' : 'text-left'} border-collapse`}>
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">{t.plate}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">{t.name}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 text-center">{t.tier}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">{t.status}</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">{t.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredVips.map((vip) => (
                <tr key={vip.id} className="hover:bg-indigo-50/20 dark:hover:bg-indigo-900/10 transition-all group">
                  <td className="px-8 py-6">
                    <div className="inline-flex items-center justify-center bg-white dark:bg-slate-800 border-2 border-indigo-600 px-4 py-2 rounded-xl shadow-lg">
                      <span className="font-mono font-black text-lg text-slate-900 dark:text-slate-100 tracking-tighter">{vip.plateText}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-base font-black text-slate-900 dark:text-slate-100 mb-0.5">{vip.fullName}</p>
                    <p className="text-[11px] text-slate-500 font-bold truncate max-w-[200px]">{vip.note}</p>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <span className={`text-[11px] font-black px-4 py-1.5 rounded-full border-2 ${vip.priority === 'Diamond' ? 'bg-indigo-600 text-white border-indigo-500' : vip.priority === 'Platinum' ? 'bg-slate-900 text-slate-100 border-slate-800' : 'bg-amber-500 text-white border-amber-400'}`}>
                      {vip.priority === 'Diamond' ? t.diamond : vip.priority === 'Platinum' ? t.platinum : t.gold}
                    </span>
                  </td>
                  <td className="px-8 py-6"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)]"></div><span className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase tracking-widest">CLEARED</span></div></td>
                  <td className="px-8 py-6">
                    <button onClick={() => handleDelete(vip.id, vip.plateText, vip.fullName)} className="p-3 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl text-rose-400 transition-all">
                       {deletingId === vip.id ? <Loader2 className="animate-spin w-5 h-5" /> : <Trash2 size={20} />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delegation Modal */}
      {showDelegationModal && (
        <div className="fixed inset-0 z-[600] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-4">
           <div className="bg-white dark:bg-slate-900 rounded-[48px] w-full max-w-7xl h-[90vh] shadow-2xl border border-white/10 flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-amber-500 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/20">
                       <Layers size={32} />
                    </div>
                    <div>
                       <h3 className="text-2xl font-black dark:text-white leading-tight">{t.delegationTitle}</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Batch Enrollment System</p>
                    </div>
                 </div>
                 <button onClick={() => setShowDelegationModal(false)} className="p-4 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all">
                    <X size={28} className="text-slate-400" />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-4 no-scrollbar">
                 <div className="grid grid-cols-12 gap-6 text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                    <div className="col-span-3">{t.fullName} *</div>
                    <div className="col-span-2">{t.plateLabel} *</div>
                    <div className="col-span-2">{t.carType}</div>
                    <div className="col-span-2">{t.carColor}</div>
                    <div className="col-span-2">{t.noteLabel}</div>
                    <div className="col-span-1"></div>
                 </div>

                 <div className="space-y-4">
                   {delegationMembers.map((member, idx) => (
                     <div key={idx} className="grid grid-cols-12 gap-4 bg-slate-50/50 dark:bg-slate-800/50 p-3 rounded-[24px] border border-slate-100 dark:border-slate-800 group transition-all hover:bg-white dark:hover:bg-slate-800 hover:shadow-lg">
                        <div className="col-span-3">
                           <input 
                             value={member.fullName}
                             onChange={(e) => updateMember(idx, 'fullName', e.target.value)}
                             placeholder="John Doe"
                             className="w-full p-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold dark:text-white outline-none focus:border-indigo-600"
                           />
                        </div>
                        <div className="col-span-2">
                           <input 
                             value={member.plateText}
                             onChange={(e) => updateMember(idx, 'plateText', e.target.value)}
                             placeholder="ABC-123"
                             dir="ltr"
                             className="w-full p-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-xs font-mono font-black dark:text-white outline-none focus:border-indigo-600 uppercase"
                           />
                        </div>
                        <div className="col-span-2">
                           <input 
                             value={member.carType}
                             onChange={(e) => updateMember(idx, 'carType', e.target.value)}
                             placeholder="Lexus LS"
                             className="w-full p-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold dark:text-white outline-none focus:border-indigo-600"
                           />
                        </div>
                        <div className="col-span-2">
                           <input 
                             value={member.color}
                             onChange={(e) => updateMember(idx, 'color', e.target.value)}
                             placeholder="Black / V8"
                             className="w-full p-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold dark:text-white outline-none focus:border-indigo-600"
                           />
                        </div>
                        <div className="col-span-2">
                           <input 
                             value={member.note}
                             onChange={(e) => updateMember(idx, 'note', e.target.value)}
                             placeholder="..."
                             className="w-full p-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold dark:text-white outline-none focus:border-indigo-600"
                           />
                        </div>
                        <div className="col-span-1 flex items-center justify-center">
                           <button onClick={() => removeDelegationRow(idx)} className="p-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100">
                              <Minus size={20} />
                           </button>
                        </div>
                     </div>
                   ))}
                 </div>

                 <button onClick={addDelegationRow} className="w-full py-6 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] flex items-center justify-center gap-4 text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all font-black text-xs uppercase tracking-widest mt-6">
                    <Plus size={24} />
                    {t.addMember}
                 </button>
              </div>

              <div className="p-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 flex justify-between items-center shrink-0">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Batch Count</span>
                    <span className="text-2xl font-black text-indigo-600">{delegationMembers.length} Guests</span>
                 </div>
                 <div className="flex gap-4">
                    <button onClick={() => setShowDelegationModal(false)} className="px-10 py-5 bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-[24px] font-black text-xs uppercase tracking-widest text-slate-500 shadow-xl">{t.cancel}</button>
                    <button onClick={handleSaveDelegation} disabled={isProcessing} className="px-12 py-5 bg-indigo-600 text-white rounded-[24px] font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95 flex items-center gap-3">
                       {isProcessing ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />}
                       {t.saveDelegation}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Add VIP Wizard Modal (Standard) */}
      {showAddForm && (
        <div className="fixed inset-0 z-[500] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-6">
           <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg"><UserPlus size={24} /></div>
                    <h3 className="text-xl font-black dark:text-white leading-tight">{t.addVip}</h3>
                 </div>
                 <button onClick={() => setShowAddForm(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"><X size={24} className="text-slate-400" /></button>
              </div>
              <div className="p-10">
                 <div className="flex items-center justify-between mb-10 px-4">
                    {[1, 2, 3].map(step => (
                      <React.Fragment key={step}>
                         <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${formStep >= step ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                               {formStep > step ? <CheckCircle2 size={18} /> : <span className="text-xs font-black">{step}</span>}
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${formStep >= step ? 'text-indigo-600' : 'text-slate-400'}`}>{step === 1 ? t.step1 : step === 2 ? t.step2 : t.step3}</span>
                         </div>
                         {step < 3 && <div className={`flex-1 h-0.5 mx-4 rounded-full transition-all ${formStep > step ? 'bg-indigo-600' : 'bg-slate-100 dark:bg-slate-800'}`}></div>}
                      </React.Fragment>
                    ))}
                 </div>
                 <div className="min-h-[250px]">
                    {formStep === 1 ? (
                      <div className="space-y-6 animate-in slide-in-from-bottom-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.fullName}</label>
                          <input value={newVip.fullName} onChange={e => setNewVip({...newVip, fullName: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black dark:text-white outline-none focus:border-indigo-600 transition-all" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.noteLabel}</label>
                          <textarea value={newVip.note} onChange={e => setNewVip({...newVip, note: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black dark:text-white outline-none focus:border-indigo-600 transition-all min-h-[100px]" />
                        </div>
                      </div>
                    ) : formStep === 2 ? (
                      <div className="space-y-6 animate-in slide-in-from-bottom-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.plateLabel}</label>
                          <input value={newVip.plateText} onChange={e => setNewVip({...newVip, plateText: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black dark:text-white outline-none focus:border-indigo-600 transition-all uppercase" dir="ltr" />
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6 animate-in slide-in-from-bottom-4">
                        {(['Gold', 'Platinum', 'Diamond'] as const).map(p => (
                          <button key={p} onClick={() => setNewVip({...newVip, priority: p})} className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${newVip.priority === p ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-500'}`}>
                             <div className="flex items-center gap-3"><Star size={16} fill={newVip.priority === p ? 'white' : 'none'} /><span className="text-xs font-black uppercase">{p}</span></div>
                             {newVip.priority === p && <CheckCircle2 size={16} />}
                          </button>
                        ))}
                      </div>
                    )}
                 </div>
                 <div className="flex gap-4 pt-10">
                    <button onClick={() => formStep > 1 ? setFormStep(formStep - 1) : setShowAddForm(false)} className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-xs uppercase">{formStep > 1 ? t.back : t.cancel}</button>
                    <button onClick={() => formStep < 3 ? setFormStep(formStep + 1) : handleSaveVip()} disabled={isProcessing} className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase shadow-xl">
                       {isProcessing ? <Loader2 className="animate-spin mx-auto" /> : formStep < 3 ? t.next : t.save}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
