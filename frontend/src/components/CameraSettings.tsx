
import React, { useState, useEffect } from 'react';
import { Camera, Gate } from '../types';
import { Power, ShieldCheck, MapPin, RefreshCw, Activity, Maximize2, Plus, ChevronLeft, ChevronRight, CheckCircle2, Globe, Wifi, Cpu, X, Signal, AlertTriangle, Camera as CameraIcon, Sparkles, Loader2, Tag, Shield, Zap, Settings2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface CameraSettingsProps {
  cameras: Camera[];
  gates: Gate[];
  onAddCamera: (camera: Camera) => void;
  language: 'ar' | 'en';
}

export const CameraSettings: React.FC<CameraSettingsProps> = ({ cameras, gates, onAddCamera, language }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [cameraSnapshots, setCameraSnapshots] = useState<Record<string, string>>({});
  const [selectedSnapshotCamera, setSelectedSnapshotCamera] = useState<{ camera: Camera, timestamp: string } | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // New Camera Form State
  const [formStep, setFormStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [newCam, setNewCam] = useState({
    name: '',
    deviceId: '',
    type: 'LPR' as 'LPR' | 'PTZ' | 'FIXED',
    streamUrl: '',
    mode: 'STRICT' as 'STRICT' | 'LENIENT',
    location: '',
    gateId: '',
    aiThreshold: 0.85
  });

  const formatNum = (num: number | string) => num.toLocaleString('en-US');

  const t = {
    title: language === 'ar' ? 'الكاميرات' : 'Cameras',
    summary: language === 'ar' ? 'نظام المراقبة والتشخيص الفوري للكاميرات' : 'Real-time diagnostic & monitoring system',
    total: language === 'ar' ? 'إجمالي الوحدات' : 'Total Units',
    online: language === 'ar' ? 'متصل' : 'Online',
    offline: language === 'ar' ? 'منقطع' : 'Offline',
    warning: language === 'ar' ? 'تحذير' : 'Warning',
    add: language === 'ar' ? 'ربط كاميرا جديدة' : 'Link New Camera',
    latency: language === 'ar' ? 'زمن الاستجابة' : 'Latency',
    confidence: language === 'ar' ? 'متوسط الدقة' : 'Avg. Confidence',
    lastSeen: language === 'ar' ? 'آخر ظهور' : 'Last Seen',
    takeSnapshot: language === 'ar' ? 'التقاط صورة' : 'Take Snapshot',
    snapshotTitle: language === 'ar' ? 'لقطة شاشة فورية' : 'Live Snapshot',
    analyzeAi: language === 'ar' ? 'تحليل بالذكاء الاصطناعي' : 'Analyze with AI',
    analyzing: language === 'ar' ? 'جاري التحليل...' : 'Analyzing...',
    next: language === 'ar' ? 'التالي' : 'Next',
    back: language === 'ar' ? 'السابق' : 'Back',
    save: language === 'ar' ? 'إتمام الربط' : 'Complete Link',
    cancel: language === 'ar' ? 'إلغاء' : 'Cancel',
    step1: language === 'ar' ? 'الهوية والنوع' : 'Identity & Type',
    step2: language === 'ar' ? 'البث والاتصال' : 'Stream & Connect',
    step3: language === 'ar' ? 'الذكاء الاصطناعي' : 'AI Config',
    nameLabel: language === 'ar' ? 'اسم الكاميرا' : 'Camera Name',
    idLabel: language === 'ar' ? 'معرف الجهاز / SN' : 'Device ID / SN',
    streamLabel: language === 'ar' ? 'رابط البث RTSP' : 'RTSP Stream URL',
    locationLabel: language === 'ar' ? 'الموقع الوصفي' : 'Description Location',
    gateLabel: language === 'ar' ? 'ربط ببوابة' : 'Link to Gate',
    modeLabel: language === 'ar' ? 'وضع التدقيق' : 'Detection Mode',
    strict: language === 'ar' ? 'صارم' : 'Strict',
    lenient: language === 'ar' ? 'مرن' : 'Lenient',
    thresholdLabel: language === 'ar' ? 'عتبة الثقة (Threshold)' : 'Confidence Threshold',
    latLevels: {
      good: language === 'ar' ? 'جيد' : 'Good',
      medium: language === 'ar' ? 'متوسط' : 'Medium',
      critical: language === 'ar' ? 'حرج' : 'Critical',
    },
    captureTime: language === 'ar' ? 'وقت الالتقاط' : 'Capture Time',
  };

  useEffect(() => {
    const newSnapshots: Record<string, string> = {};
    cameras.forEach(cam => {
      newSnapshots[cam.id] = `https://loremflickr.com/640/360/street,car,traffic?lock=${cam.id.length + 50}`;
    });
    setCameraSnapshots(newSnapshots);
  }, [cameras]);

  const stats = {
    total: cameras.length,
    online: cameras.filter(c => c.status === 'ONLINE').length,
    offline: cameras.filter(c => c.status === 'OFFLINE').length,
    warning: cameras.filter(c => c.status === 'WARNING').length,
  };

  const handleSaveCamera = async () => {
    if (!newCam.name || !newCam.deviceId || !newCam.gateId) return;
    setIsSaving(true);
    try {
      await new Promise(r => setTimeout(r, 1200));
      const cam: Camera = {
        id: newCam.deviceId,
        gateId: newCam.gateId,
        name: newCam.name,
        location: newCam.location,
        status: 'ONLINE',
        lastSeenAt: new Date().toISOString(),
        latencyMs: 35 + Math.floor(Math.random() * 20),
        avgConfidence: newCam.aiThreshold,
        streamUrl: newCam.streamUrl,
        mode: newCam.mode
      };
      onAddCamera(cam);
      setShowAddModal(false);
      resetForm();
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setNewCam({ name: '', deviceId: '', type: 'LPR', streamUrl: '', mode: 'STRICT', location: '', gateId: '', aiThreshold: 0.85 });
    setFormStep(1);
  };

  const renderAddWizard = () => {
    switch (formStep) {
      case 1:
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
             <div className="grid grid-cols-3 gap-4">
                {(['LPR', 'PTZ', 'FIXED'] as const).map(t => (
                  <button 
                    key={t}
                    onClick={() => setNewCam({...newCam, type: t})}
                    className={`p-5 rounded-[24px] border-2 transition-all flex flex-col items-center gap-3 ${newCam.type === t ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20 shadow-lg' : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'}`}
                  >
                     <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${newCam.type === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                        {t === 'LPR' ? <Tag size={20} /> : t === 'PTZ' ? <Maximize2 size={20} /> : <Shield size={20} />}
                     </div>
                     <span className="text-[9px] font-black uppercase tracking-widest">{t}</span>
                  </button>
                ))}
             </div>
             <div className="space-y-4">
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.nameLabel}</label>
                   <input value={newCam.name} onChange={e => setNewCam({...newCam, name: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black dark:text-white outline-none focus:border-indigo-600 transition-all" />
                </div>
                <div className="space-y-1">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.idLabel}</label>
                   <input value={newCam.deviceId} onChange={e => setNewCam({...newCam, deviceId: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black dark:text-white outline-none focus:border-indigo-600 transition-all uppercase" placeholder="CAM-XXXXX" />
                </div>
             </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-300">
             <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.streamLabel}</label>
                <div className="relative">
                  <Wifi className={`absolute ${language === 'ar' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 text-slate-400`} size={18} />
                  <input value={newCam.streamUrl} onChange={e => setNewCam({...newCam, streamUrl: e.target.value})} className={`w-full ${language === 'ar' ? 'pr-12 pl-6' : 'pl-12 pr-6'} py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-xs font-black dark:text-white outline-none focus:border-indigo-600 transition-all`} placeholder="rtsp://admin:pass@ip:port/stream" dir="ltr" />
                </div>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.gateLabel}</label>
                <select value={newCam.gateId} onChange={e => setNewCam({...newCam, gateId: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black dark:text-white outline-none">
                   <option value="">{language === 'ar' ? 'اختر البوابة المرتبطة' : 'Select Linked Gate'}</option>
                   {gates.map(g => <option key={g.id} value={g.id}>{language === 'ar' ? g.nameAr : g.nameEn}</option>)}
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.locationLabel}</label>
                <input value={newCam.location} onChange={e => setNewCam({...newCam, location: e.target.value})} className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl text-sm font-black dark:text-white outline-none" />
             </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-300">
             <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">{t.modeLabel}</label>
                <div className="flex p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl">
                   {(['STRICT', 'LENIENT'] as const).map(m => (
                     <button key={m} onClick={() => setNewCam({...newCam, mode: m})} className={`flex-1 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newCam.mode === m ? 'bg-white dark:bg-slate-700 text-indigo-600 shadow-xl' : 'text-slate-500'}`}>
                        {m === 'STRICT' ? t.strict : t.lenient}
                     </button>
                   ))}
                </div>
                <p className="text-[9px] text-slate-400 font-bold px-3">
                   {newCam.mode === 'STRICT' ? 'يتطلب مطابقة دقيقة 100% للوحة (يوصى به للمناطق الحساسة)' : 'يسمح بنسبة تفاوت طفيفة في التعرف لزيادة سرعة المعالجة'}
                </p>
             </div>
             <div className="space-y-3">
                <div className="flex justify-between items-center px-2">
                   <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.thresholdLabel}</label>
                   <span className="text-xs font-black text-indigo-600">{(newCam.aiThreshold * 100).toFixed(0)}%</span>
                </div>
                <input type="range" min="0.5" max="0.99" step="0.01" value={newCam.aiThreshold} onChange={e => setNewCam({...newCam, aiThreshold: parseFloat(e.target.value)})} className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full appearance-none cursor-pointer accent-indigo-600" />
             </div>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-24 transition-all">
      {/* Summary Header */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch">
         <div className="bg-indigo-600 p-10 rounded-[40px] text-white flex-1 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 space-y-2">
               <h1 className="text-3xl font-black tracking-tight">{t.title}</h1>
               <p className="text-indigo-100 font-bold opacity-80">{t.summary}</p>
            </div>
            <Activity className="absolute bottom-0 right-0 w-48 h-48 text-indigo-500/20 -mb-12 -mr-12" />
         </div>
         
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-[2]">
            {[
              { label: t.total, val: stats.total, color: 'text-slate-900 dark:text-white', icon: Activity },
              { label: t.online, val: stats.online, color: 'text-emerald-500', icon: Signal },
              { label: t.offline, val: stats.offline, color: 'text-rose-500', icon: Power },
              { label: t.warning, val: stats.warning, color: 'text-amber-500', icon: AlertTriangle },
            ].map((s, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-xl flex flex-col justify-between group hover:border-indigo-500 transition-all">
                 <s.icon className={`${s.color} opacity-40 group-hover:scale-110 transition-transform`} size={24} />
                 <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                    <p className={`text-2xl font-black tabular-nums ${s.color}`}>{formatNum(s.val)}</p>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* Cameras Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {cameras.map((camera) => {
          const latInfo = (ms: number) => {
            if (ms < 100) return { color: 'emerald', label: t.latLevels.good };
            if (ms < 250) return { color: 'amber', label: t.latLevels.medium };
            return { color: 'rose', label: t.latLevels.critical };
          };
          const info = latInfo(camera.latencyMs);
          const colorClass = info.color === 'emerald' ? 'bg-emerald-500' : info.color === 'amber' ? 'bg-amber-500' : 'bg-rose-500';
          const textColorClass = info.color === 'emerald' ? 'text-emerald-500' : info.color === 'amber' ? 'text-amber-500' : 'text-rose-500';

          return (
            <div key={camera.id} className={`bg-white dark:bg-slate-900 rounded-[32px] border-2 transition-all duration-500 overflow-hidden flex flex-col group shadow-xl ${
              camera.status === 'OFFLINE' ? 'border-rose-500/30' : 'border-slate-100 dark:border-slate-800 hover:border-indigo-500'
            }`}>
              <div className="relative h-48 overflow-hidden bg-slate-900">
                 <img src={cameraSnapshots[camera.id]} className={`w-full h-full object-cover transition-all duration-1000 ${camera.status === 'OFFLINE' ? 'grayscale opacity-30' : 'group-hover:scale-110'}`} alt="Feed" />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                 <div className={`absolute top-4 ${language === 'ar' ? 'right-4' : 'left-4'} flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full border border-white/10`}>
                    <div className={`w-2 h-2 rounded-full ${camera.status === 'ONLINE' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></div>
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{camera.status}</span>
                 </div>
                 <div className="absolute bottom-4 inset-x-4 flex justify-between items-end">
                    <div className="text-white">
                       <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-0.5">ID: {camera.id}</p>
                       <h3 className="text-lg font-black leading-tight truncate">{camera.name}</h3>
                    </div>
                 </div>
              </div>

              <div className="p-6 space-y-6 flex-1">
                 <div className="space-y-2">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                       <span className="text-slate-400 flex items-center gap-1.5"><Wifi size={12} className={textColorClass} />{t.latency}</span>
                       <span className={textColorClass + " tabular-nums"}>{camera.latencyMs}ms</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex relative">
                       <div className={`h-full transition-all duration-1000 ${colorClass}`} style={{ width: `${Math.min(100, Math.max(5, (camera.latencyMs / 500) * 100))}%` }}></div>
                       {camera.latencyMs > 250 && <div className="absolute inset-0 bg-rose-500 animate-pulse opacity-30"></div>}
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{t.confidence}</p>
                       <p className="text-sm font-black text-slate-700 dark:text-slate-300">{(camera.avgConfidence * 100).toFixed(1)}%</p>
                    </div>
                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                       <p className="text-[9px] font-black text-slate-400 uppercase mb-1">{t.lastSeen}</p>
                       <p className="text-sm font-black text-slate-700 dark:text-slate-300">{new Date(camera.lastSeenAt).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                 </div>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-950/40 border-t border-slate-100 dark:border-slate-800 flex justify-between gap-3">
                 <button onClick={() => setSelectedSnapshotCamera({ camera, timestamp: new Date().toLocaleString() })} className="flex-1 py-2 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-xl hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"><CameraIcon size={14} />{t.takeSnapshot}</button>
                 <button className="flex-1 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] font-black uppercase rounded-xl hover:bg-slate-100 transition-all">Diagnostic</button>
              </div>
            </div>
          );
        })}
        
        <button 
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="bg-white/50 dark:bg-slate-900/50 rounded-[32px] border-4 border-dashed border-slate-200 dark:border-slate-800 hover:border-indigo-400 hover:bg-indigo-50/10 transition-all flex flex-col items-center justify-center p-12 group min-h-[400px]"
        >
           <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-indigo-600 shadow-xl group-hover:scale-110 transition-all mb-4"><Plus size={32} /></div>
           <h3 className="text-sm font-black text-slate-400 group-hover:text-indigo-900 dark:group-hover:text-indigo-300 uppercase tracking-widest">{t.add}</h3>
        </button>
      </div>

      {/* Add Camera Wizard Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[600] bg-slate-950/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 rounded-[48px] w-full max-w-xl shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300 flex flex-col">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
                       <Settings2 size={24} />
                    </div>
                    <div>
                       <h3 className="text-xl font-black dark:text-white leading-tight">{t.add}</h3>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Network Edge Configuration</p>
                    </div>
                 </div>
                 <button onClick={() => setShowAddModal(false)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"><X size={24} className="text-slate-400" /></button>
              </div>

              <div className="p-10 flex-1 overflow-y-auto no-scrollbar">
                 {/* Step Indicator */}
                 <div className="flex items-center justify-between mb-10 px-4">
                    {[1, 2, 3].map(step => (
                      <React.Fragment key={step}>
                         <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${formStep >= step ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'}`}>
                               {formStep > step ? <CheckCircle2 size={18} /> : <span className="text-xs font-black">{step}</span>}
                            </div>
                            <span className={`text-[8px] font-black uppercase tracking-widest ${formStep >= step ? 'text-indigo-600' : 'text-slate-400'}`}>
                              {step === 1 ? t.step1 : step === 2 ? t.step2 : t.step3}
                            </span>
                         </div>
                         {step < 3 && <div className={`flex-1 h-0.5 mx-4 rounded-full transition-all ${formStep > step ? 'bg-indigo-600' : 'bg-slate-100 dark:bg-slate-800'}`}></div>}
                      </React.Fragment>
                    ))}
                 </div>

                 <div className="min-h-[300px]">
                    {renderAddWizard()}
                 </div>
              </div>

              <div className="p-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30 flex justify-end gap-4">
                 <button 
                  onClick={() => formStep > 1 ? setFormStep(formStep - 1) : setShowAddModal(false)}
                  className="px-8 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-[20px] font-black text-xs uppercase tracking-widest text-slate-500"
                 >
                   {formStep > 1 ? t.back : t.cancel}
                 </button>
                 <button 
                  onClick={() => formStep < 3 ? setFormStep(formStep + 1) : handleSaveCamera()}
                  disabled={isSaving}
                  className="px-10 py-4 bg-indigo-600 text-white rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-3"
                 >
                    {isSaving ? <Loader2 className="animate-spin" size={18} /> : (formStep < 3 ? t.next : t.save)}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Snapshot Modal */}
      {selectedSnapshotCamera && (
        <div className="fixed inset-0 z-[600] bg-black/80 backdrop-blur-xl flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="bg-white dark:bg-slate-900 rounded-[40px] w-full max-w-5xl shadow-2xl overflow-hidden border border-white/10 flex flex-col max-h-[90vh]">
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white"><CameraIcon size={24} /></div>
                    <div>
                       <h3 className="text-xl font-black dark:text-white leading-tight">{selectedSnapshotCamera.camera.name}</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.snapshotTitle}</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedSnapshotCamera(null)} className="p-3 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl transition-all"><X size={24} className="text-slate-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar p-8">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="relative aspect-video rounded-[32px] overflow-hidden bg-black shadow-inner border border-white/5 group">
                       <img src={`https://loremflickr.com/1280/720/street,car,traffic?lock=${selectedSnapshotCamera.camera.id.length + 100}`} className="w-full h-full object-cover" alt="Captured Frame" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20"></div>
                       <div className="absolute bottom-8 left-8 right-8 flex justify-between items-end text-white">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{t.captureTime}</p>
                             <p className="text-lg font-black tabular-nums">{selectedSnapshotCamera.timestamp}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                             <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                                <span className="text-[10px] font-black uppercase tracking-widest">Confidence: {(selectedSnapshotCamera.camera.avgConfidence * 100).toFixed(1)}%</span>
                             </div>
                             <div className="flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                                <MapPin size={12} className="text-indigo-400" /><span className="text-[10px] font-black uppercase tracking-widest">{selectedSnapshotCamera.camera.location}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-6">
                       <div className="flex items-center justify-between">
                          <h4 className="text-sm font-black dark:text-white uppercase tracking-widest flex items-center gap-2"><Sparkles className="text-indigo-500" size={18} />{t.analyzeAi}</h4>
                       </div>
                       <div className="p-6 rounded-[32px] border min-h-[300px] bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 flex items-center justify-center">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic opacity-50">Intelligence Ready</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
