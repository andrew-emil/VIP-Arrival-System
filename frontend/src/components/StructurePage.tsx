
import React, { useState, useEffect } from 'react';
import { Zone, Gate, Camera, CameraStatus } from '../types';
import { VAS_ICONS } from '../config/icons';
import { ChevronRight, ChevronLeft, CheckCircle2, Shield, Wifi, Tag, MapPin } from 'lucide-react';

interface StructurePageProps {
  zones: Zone[];
  gates: Gate[];
  cameras: Camera[];
  setZones: React.Dispatch<React.SetStateAction<Zone[]>>;
  setGates: React.Dispatch<React.SetStateAction<Gate[]>>;
  setCameras: React.Dispatch<React.SetStateAction<Camera[]>>;
  language: 'ar' | 'en';
}

type EntityType = 'zone' | 'gate' | 'camera';

export const StructurePage: React.FC<StructurePageProps> = ({ 
  zones, gates, cameras, 
  setZones, setGates, setCameras, 
  language 
}) => {
  const [activeView, setActiveView] = useState<'zones' | 'gates' | 'cameras'>('zones');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<EntityType>('zone');
  const [cameraStep, setCameraStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  // Form states
  const [formData, setFormData] = useState({
    nameAr: '',
    nameEn: '',
    zoneId: '',
    gateId: '',
    location: '',
    deviceId: '',
    streamUrl: '',
    mode: 'STRICT' as 'STRICT' | 'LENIENT',
    cameraType: 'LPR' as 'LPR' | 'PTZ' | 'FIXED'
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Fixed the error: Added missing zoneLabel property to the translation object
  const t = {
    title: language === 'ar' ? 'تخطيط الموقع والهيكل' : 'Site Map & Structure',
    zones: language === 'ar' ? 'المناطق' : 'Zones',
    gates: language === 'ar' ? 'البوابات' : 'Gates',
    cameras: language === 'ar' ? 'الكاميرات' : 'Cameras',
    addZone: language === 'ar' ? 'إضافة منطقة' : 'New Zone',
    addGate: language === 'ar' ? 'إضافة بوابة' : 'New Gate',
    addCamera: language === 'ar' ? 'ربط كاميرا جديدة' : 'Link New Camera',
    save: language === 'ar' ? 'حفظ البيانات' : 'Save Changes',
    cancel: language === 'ar' ? 'إلغاء' : 'Cancel',
    next: language === 'ar' ? 'التالي' : 'Next',
    back: language === 'ar' ? 'السابق' : 'Back',
    nameAr: language === 'ar' ? 'الاسم (عربي)' : 'Name (Arabic)',
    nameEn: language === 'ar' ? 'الاسم (إنجليزي)' : 'Name (English)',
    location: language === 'ar' ? 'الموقع الوصفي' : 'Descriptive Location',
    deviceId: language === 'ar' ? 'معرف الجهاز / SN' : 'Device ID / SN',
    streamUrl: language === 'ar' ? 'رابط بث RTSP/HTTP' : 'RTSP/HTTP Stream URL',
    mode: language === 'ar' ? 'وضع التدقيق' : 'Detection Mode',
    strict: language === 'ar' ? 'صارم' : 'Strict',
    lenient: language === 'ar' ? 'مرن' : 'Lenient',
    step1: language === 'ar' ? 'التسمية والنوع' : 'Identity & Type',
    step2: language === 'ar' ? 'طريقة الربط' : 'Connectivity',
    step3: language === 'ar' ? 'التوزيع الجغرافي' : 'Deployment',
    camType: language === 'ar' ? 'نوع الكاميرا' : 'Camera Type',
    zoneLabel: language === 'ar' ? 'المنطقة' : 'Zone',
    confirmDelete: language === 'ar' ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?',
    deleteWarning: language === 'ar' ? 'لا يمكن حذف العنصر لوجود ارتباطات نشطة' : 'Cannot delete item with active associations',
  };

  const handleAdd = () => {
    if (activeView === 'zones') {
      const newZone: Zone = {
        id: `z-${Date.now()}`,
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
      };
      setZones([...zones, newZone]);
    } else if (activeView === 'gates') {
      const newGate: Gate = {
        id: `g-${Date.now()}`,
        zoneId: formData.zoneId,
        nameAr: formData.nameAr,
        nameEn: formData.nameEn,
      };
      setGates([...gates, newGate]);
    } else if (activeView === 'cameras') {
      const newCam: Camera = {
        id: formData.deviceId || `cam-${Date.now()}`,
        gateId: formData.gateId,
        name: formData.nameAr,
        location: formData.location,
        status: 'ONLINE',
        lastSeenAt: new Date().toISOString(),
        latencyMs: 40,
        avgConfidence: 0.95,
        streamUrl: formData.streamUrl,
        mode: formData.mode,
      };
      setCameras([...cameras, newCam]);
    }
    setShowModal(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ 
      nameAr: '', nameEn: '', zoneId: '', gateId: '', 
      location: '', deviceId: '', streamUrl: '', mode: 'STRICT',
      cameraType: 'LPR'
    });
    setCameraStep(1);
  };

  const renderCameraWizard = () => {
    switch (cameraStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
            <div className="grid grid-cols-2 gap-4">
               {(['LPR', 'PTZ', 'FIXED'] as const).map(type => (
                 <button 
                  key={type}
                  onClick={() => setFormData({...formData, cameraType: type})}
                  className={`p-6 rounded-[24px] border-2 transition-all flex flex-col items-center gap-3 ${formData.cameraType === type ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-lg' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                 >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${formData.cameraType === type ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                       {type === 'LPR' ? <Tag size={24} /> : type === 'PTZ' ? <VAS_ICONS.expand size={24} /> : <Shield size={24} />}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest">{type}</span>
                 </button>
               ))}
            </div>
            <div className="space-y-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.nameAr}</label>
                  <input 
                    value={formData.nameAr}
                    onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black dark:text-white outline-none focus:border-indigo-600 transition-all" 
                    placeholder="مثال: كاميرا المدخل الشمالي"
                  />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.deviceId}</label>
                  <input 
                    value={formData.deviceId}
                    onChange={(e) => setFormData({...formData, deviceId: e.target.value})}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black dark:text-white outline-none focus:border-indigo-600 transition-all" 
                    placeholder="CAM-LPR-123456"
                  />
               </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.streamUrl}</label>
                <div className="relative">
                   <Wifi className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input 
                    value={formData.streamUrl}
                    onChange={(e) => setFormData({...formData, streamUrl: e.target.value})}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black dark:text-white outline-none focus:border-indigo-600 transition-all" 
                    placeholder="rtsp://admin:password@192.168.1.10..."
                    dir="ltr"
                   />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.mode}</label>
                <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                   {(['STRICT', 'LENIENT'] as const).map(m => (
                     <button 
                      key={m}
                      onClick={() => setFormData({...formData, mode: m})}
                      className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase transition-all ${formData.mode === m ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-sm' : 'text-slate-500'}`}
                     >
                        {m === 'STRICT' ? t.strict : t.lenient}
                     </button>
                   ))}
                </div>
                <p className="text-[9px] text-slate-400 font-bold px-2">
                   {formData.mode === 'STRICT' ? 'يتطلب مطابقة دقيقة جداً للوحة (يوصى به للمداخل الحساسة)' : 'يسمح بنسبة تفاوت في التعرف لسرعة المعالجة'}
                </p>
             </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6 animate-in slide-in-from-left-4 duration-300">
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.location}</label>
                <input 
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black dark:text-white outline-none focus:border-indigo-600 transition-all" 
                />
             </div>
             <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{language === 'ar' ? 'البوابة' : 'Gate'}</label>
                <select 
                  value={formData.gateId}
                  onChange={(e) => setFormData({...formData, gateId: e.target.value})}
                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black dark:text-white outline-none"
                >
                   <option value="">{language === 'ar' ? 'اختر البوابة' : 'Select Gate'}</option>
                   {gates.map(g => <option key={g.id} value={g.id}>{language === 'ar' ? g.nameAr : g.nameEn}</option>)}
                </select>
             </div>
          </div>
        );
      default:
        return null;
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center justify-between mb-10 px-4">
       {[1, 2, 3].map(step => (
         <React.Fragment key={step}>
            <div className="flex flex-col items-center gap-2">
               <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${cameraStep >= step ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                  {cameraStep > step ? <CheckCircle2 size={20} /> : <span className="text-xs font-black">{step}</span>}
               </div>
               <span className={`text-[8px] font-black uppercase tracking-widest ${cameraStep >= step ? 'text-indigo-600' : 'text-slate-400'}`}>
                 {step === 1 ? t.step1 : step === 2 ? t.step2 : t.step3}
               </span>
            </div>
            {step < 3 && <div className={`flex-1 h-0.5 mx-4 rounded-full transition-all ${cameraStep > step ? 'bg-indigo-600' : 'bg-slate-100 dark:bg-slate-800'}`}></div>}
         </React.Fragment>
       ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div className={language === 'ar' ? 'text-right' : 'text-left'}>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{t.title}</h1>
          <p className="text-slate-500 font-bold text-sm mt-1">{language === 'ar' ? 'إدارة التوزيع الجغرافي ونقاط الرصد' : 'Manage site distribution and detection points'}</p>
        </div>
        <div className="flex p-1 bg-slate-200 dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-inner">
           {(['zones', 'gates', 'cameras'] as const).map(v => (
             <button 
              key={v}
              onClick={() => setActiveView(v)}
              className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeView === v ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xl scale-[1.05]' : 'text-slate-500 hover:text-slate-700'
              }`}
             >
               {t[v]}
             </button>
           ))}
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <div key={i} className="h-48 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeView === 'zones' && zones.map(z => (
             <div key={z.id} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl relative group">
                <button className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all" onClick={() => { if(gates.some(g => g.zoneId === z.id)) alert(t.deleteWarning); else if(window.confirm(t.confirmDelete)) setZones(zones.filter(zone => zone.id !== z.id)); }}><VAS_ICONS.trash size={18} /></button>
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-2xl flex items-center justify-center mb-6"><VAS_ICONS.zones size={28} /></div>
                <h3 className="text-xl font-black dark:text-white">{language === 'ar' ? z.nameAr : z.nameEn}</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase mt-2">{gates.filter(g => g.zoneId === z.id).length} Gates Connected</p>
             </div>
          ))}

          {activeView === 'gates' && gates.map(g => (
             <div key={g.id} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl relative group">
                <button className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all" onClick={() => { if(cameras.some(c => c.gateId === g.id)) alert(t.deleteWarning); else if(window.confirm(t.confirmDelete)) setGates(gates.filter(gate => gate.id !== g.id)); }}><VAS_ICONS.trash size={18} /></button>
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 rounded-2xl flex items-center justify-center mb-6"><VAS_ICONS.gates size={28} /></div>
                <h3 className="text-xl font-black dark:text-white">{language === 'ar' ? g.nameAr : g.nameEn}</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase mt-2">{cameras.filter(c => c.gateId === g.id).length} Cameras Active</p>
             </div>
          ))}

          {activeView === 'cameras' && cameras.map(c => (
             <div key={c.id} className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl relative group">
                <button className="absolute top-6 left-6 opacity-0 group-hover:opacity-100 p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-xl transition-all" onClick={() => { if(window.confirm(t.confirmDelete)) setCameras(cameras.filter(cam => cam.id !== c.id)); }}><VAS_ICONS.trash size={18} /></button>
                <div className="w-14 h-14 bg-amber-50 dark:bg-amber-900/30 text-amber-600 rounded-2xl flex items-center justify-center mb-6"><VAS_ICONS.cameras size={28} /></div>
                <h3 className="text-xl font-black dark:text-white mb-1">{c.name}</h3>
                <p className="text-[10px] text-slate-400 font-black uppercase mb-4">{c.location}</p>
                <div className="flex gap-2">
                   <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${c.mode === 'STRICT' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'}`}>{c.mode}</span>
                   <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 text-[8px] font-black uppercase">{c.status}</span>
                </div>
             </div>
          ))}

          <button 
            onClick={() => { setModalType(activeView === 'zones' ? 'zone' : activeView === 'gates' ? 'gate' : 'camera'); setShowModal(true); }}
            className="bg-white/50 dark:bg-slate-900/50 rounded-[40px] border-4 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 transition-all flex flex-col items-center justify-center p-12 group min-h-[200px]"
          >
             <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-indigo-600 shadow-md group-hover:scale-110 transition-all mb-4">
                <VAS_ICONS.plus size={24} />
             </div>
             <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-900 uppercase tracking-widest">{activeView === 'zones' ? t.addZone : activeView === 'gates' ? t.addGate : t.addCamera}</span>
          </button>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[500] bg-slate-950/60 backdrop-blur-md flex items-center justify-center p-6">
           <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                 <h3 className="text-xl font-black dark:text-white">
                   {modalType === 'zone' ? t.addZone : modalType === 'gate' ? t.addGate : t.addCamera}
                 </h3>
                 <button onClick={() => setShowModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all">
                    <X size={24} className="text-slate-400" />
                 </button>
              </div>

              <div className="p-10">
                 {modalType === 'camera' && <StepIndicator />}
                 
                 <div className="min-h-[250px]">
                    {modalType === 'camera' ? renderCameraWizard() : (
                       <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.nameAr}</label>
                            <input 
                              value={formData.nameAr}
                              onChange={(e) => setFormData({...formData, nameAr: e.target.value})}
                              className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black dark:text-white outline-none focus:border-indigo-600 transition-all" 
                            />
                          </div>
                          {modalType === 'gate' && (
                             <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.zoneLabel}</label>
                                <select 
                                  value={formData.zoneId}
                                  onChange={(e) => setFormData({...formData, zoneId: e.target.value})}
                                  className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black dark:text-white outline-none"
                                >
                                   <option value="">Select Zone</option>
                                   {zones.map(z => <option key={z.id} value={z.id}>{language === 'ar' ? z.nameAr : z.nameEn}</option>)}
                                </select>
                             </div>
                          )}
                       </div>
                    )}
                 </div>

                 <div className="flex gap-4 pt-10">
                    <button 
                      onClick={() => {
                        if (modalType === 'camera' && cameraStep > 1) setCameraStep(prev => prev - 1);
                        else setShowModal(false);
                      }}
                      className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-widest"
                    >
                       {modalType === 'camera' && cameraStep > 1 ? (
                         <div className="flex items-center justify-center gap-2">
                            <ChevronLeft size={16} className={language === 'ar' ? 'rotate-180' : ''} />
                            {t.back}
                         </div>
                       ) : t.cancel}
                    </button>
                    <button 
                      onClick={() => {
                        if (modalType === 'camera' && cameraStep < 3) setCameraStep(prev => prev + 1);
                        else handleAdd();
                      }}
                      className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-indigo-700 transition-all active:scale-95"
                    >
                       {modalType === 'camera' && cameraStep < 3 ? (
                         <div className="flex items-center justify-center gap-2">
                            {t.next}
                            <ChevronRight size={16} className={language === 'ar' ? 'rotate-180' : ''} />
                         </div>
                       ) : t.save}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const X = ({ size, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);
