
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { VIPDirectory } from './components/VIPDirectory';
import { CameraSettings } from './components/CameraSettings';
import { History } from './components/History';
import { StructurePage } from './components/StructurePage';
import { UsersPage } from './components/UsersPage';
import { SettingsPage } from './components/SettingsPage';
import { VipDetailsDrawer } from './components/VipDetailsDrawer';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { AIAssistant } from './components/AIAssistant';
import { 
  ArrivalEvent, VIP, Camera, NotificationItem, 
  AppSettings, Zone, Gate, UserAccount, UserRole 
} from '../types';
import { Sparkles } from 'lucide-react';

// Mock Constants
const DEFAULT_SETTINGS: AppSettings = {
  language: 'ar',
  theme: 'dark',
  soundAlerts: false,
  timezone: 'Asia/Riyadh',
  uiDensity: 'comfortable',
  glowIntensity: 'medium',
  notifs: { vip: true, system: true, confidence: true }
};

const App: React.FC = () => {
  // Persistence Loading
  const load = (key: string, def: any) => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : def;
  };

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [settings, setSettings] = useState<AppSettings>(() => load('vas_settings', DEFAULT_SETTINGS));
  const [zones, setZones] = useState<Zone[]>(() => load('vas_zones', [{ id: 'z1', nameAr: 'المنطقة الشمالية', nameEn: 'North Zone' }]));
  const [gates, setGates] = useState<Gate[]>(() => load('vas_gates', [{ id: 'g1', zoneId: 'z1', nameAr: 'بوابة كبار الزوار', nameEn: 'VIP Gate' }]));
  const [users, setUsers] = useState<UserAccount[]>(() => load('vas_users', [
    { id: 'u1', name: 'عبدالرحمن القحطاني', email: 'admin@vas.io', role: 'Admin', status: 'Active', createdAt: new Date().toISOString() }
  ]));
  
  const [vips, setVips] = useState<VIP[]>(() => load('vas_vips', [
    { id: 'v1', plateText: 'VIP-777', fullName: 'جون ويك', priority: 'Diamond', note: 'عضو فندق كونتيننتال', status: 'CLEARED' }
  ]));
  
  const [cameras, setCameras] = useState<Camera[]>(() => load('vas_cameras', [
    { id: 'cam-01', gateId: 'g1', name: 'كاميرا المدخل 1', location: 'المحيط الخارجي', status: 'ONLINE', lastSeenAt: new Date().toISOString(), latencyMs: 45, avgConfidence: 0.98, mode: 'STRICT' }
  ]));

  const [events, setEvents] = useState<ArrivalEvent[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [selectedVipId, setSelectedVipId] = useState<string | null>(null);
  const [isNotifDrawerOpen, setIsNotifDrawerOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // Sync state to localStorage
  useEffect(() => localStorage.setItem('vas_settings', JSON.stringify(settings)), [settings]);
  useEffect(() => localStorage.setItem('vas_zones', JSON.stringify(zones)), [zones]);
  useEffect(() => localStorage.setItem('vas_gates', JSON.stringify(gates)), [gates]);
  useEffect(() => localStorage.setItem('vas_cameras', JSON.stringify(cameras)), [cameras]);
  useEffect(() => localStorage.setItem('vas_users', JSON.stringify(users)), [users]);
  useEffect(() => localStorage.setItem('vas_vips', JSON.stringify(vips)), [vips]);

  // Global UI Effects
  useEffect(() => {
    document.documentElement.dir = settings.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = settings.language;
    if (settings.theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [settings.language, settings.theme]);

  const pushNotification = useCallback((notif: Omit<NotificationItem, 'id' | 'createdAt' | 'isRead' | 'isPinned'>) => {
    const newNotif: NotificationItem = {
      ...notif,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      isRead: false,
      isPinned: false
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 50));
    if (settings.soundAlerts && newNotif.severity === 'critical') {
      new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {});
    }
  }, [settings.soundAlerts]);

  const simulateArrival = useCallback(() => {
    if (vips.length === 0 || cameras.length === 0) return;
    const isVip = Math.random() > 0.4;
    const onlineCameras = cameras.filter(c => c.status === 'ONLINE');
    if (onlineCameras.length === 0) return;

    const randomCam = onlineCameras[Math.floor(Math.random() * onlineCameras.length)];
    let plate = `PL-${Math.floor(1000 + Math.random() * 9000)}`;
    let vipInfo: VIP | undefined;

    if (isVip) {
      vipInfo = vips[Math.floor(Math.random() * vips.length)];
      plate = vipInfo.plateText;
    }

    const newEvent: ArrivalEvent = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      plateText: plate,
      confidence: 0.92 + Math.random() * 0.08,
      cameraName: randomCam.name,
      location: randomCam.location,
      status: 'APPROACHING',
      isVip: isVip,
      vipInfo: vipInfo,
      imageUrl: `https://loremflickr.com/640/480/car?lock=${Math.floor(Math.random() * 1000)}`,
      rawPayload: { plate, cam: randomCam.id, ts: Date.now() }
    };

    setEvents(prev => [newEvent, ...prev].slice(0, 100));

    if (isVip && vipInfo) {
      setVips(prev => prev.map(v => v.id === vipInfo!.id ? { ...v, status: 'APPROACHING' } : v));
      pushNotification({
        type: 'VIP_APPROACHING',
        titleAr: `رصد VIP: ${vipInfo.fullName}`,
        titleEn: `VIP Detected: ${vipInfo.fullName}`,
        messageAr: `تم التعرف على اللوحة ${plate} عند ${randomCam.name}`,
        messageEn: `Plate ${plate} identified at ${randomCam.name}`,
        severity: 'critical',
        vipId: vipInfo.id
      });
    }
  }, [vips, cameras, pushNotification]);

  // Periodic Tasks
  useEffect(() => {
    const interval = setInterval(simulateArrival, 30000);
    return () => clearInterval(interval);
  }, [simulateArrival]);

  const renderContent = () => {
    const commonProps = { language: settings.language };
    switch (activeTab) {
      case 'dashboard': return <Dashboard events={events} vips={vips} onSimulate={simulateArrival} onVipClick={setSelectedVipId} {...commonProps} />;
      case 'vips': return <VIPDirectory vips={vips} onAddVip={(v) => setVips([...vips, v])} onDeleteVip={(id) => setVips(vips.filter(v => v.id !== id))} {...commonProps} />;
      case 'cameras': return <CameraSettings cameras={cameras} gates={gates} onAddCamera={(cam) => setCameras([...cameras, cam])} {...commonProps} />;
      case 'history': return <History events={events} onEventClick={(e) => e.isVip && setSelectedVipId(e.vipInfo?.id || null)} {...commonProps} />;
      case 'structure': return <StructurePage zones={zones} gates={gates} cameras={cameras} setZones={setZones} setGates={setGates} setCameras={setCameras} {...commonProps} />;
      case 'users': return <UsersPage users={users} setUsers={setUsers} {...commonProps} />;
      case 'settings': return <SettingsPage settings={settings} setSettings={setSettings} {...commonProps} />;
      default: return <Dashboard events={events} vips={vips} onSimulate={simulateArrival} onVipClick={setSelectedVipId} {...commonProps} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      settings={settings}
      unreadNotifsCount={notifications.filter(n => !n.isRead).length}
      onBellClick={() => setIsNotifDrawerOpen(true)}
    >
      <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 h-full">
        {renderContent()}
      </div>

      <button 
        onClick={() => setIsAIAssistantOpen(true)}
        className="fixed bottom-10 right-10 w-16 h-16 bg-indigo-600 text-white rounded-[24px] shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 group overflow-hidden border-2 border-white/20"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 to-violet-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <Sparkles size={28} className="relative z-10 animate-pulse" />
      </button>
      
      <VipDetailsDrawer 
        vip={vips.find(v => v.id === selectedVipId)} 
        onClose={() => setSelectedVipId(null)} 
        language={settings.language}
        onAction={(type) => {
          if (type === 'CONFIRM_ARRIVED') setVips(prev => prev.map(v => v.id === selectedVipId ? { ...v, status: 'CLEARED' } : v));
        }}
        logs={[]}
        recentReads={events.filter(e => e.vipInfo?.id === selectedVipId).slice(0, 5)}
      />

      <NotificationsDrawer 
        isOpen={isNotifDrawerOpen} 
        onClose={() => setIsNotifDrawerOpen(false)}
        notifications={notifications}
        language={settings.language}
        onMarkRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))}
        onPin={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, isPinned: !n.isPinned } : n))}
        onAction={(n) => {
          if (n.vipId) setSelectedVipId(n.vipId);
          setIsNotifDrawerOpen(false);
        }}
      />

      <AIAssistant 
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        language={settings.language}
        systemContext={{
          vipsCount: vips.length,
          camerasCount: cameras.length,
          activeAlerts: notifications.filter(n => !n.isRead).length,
          recentEvents: events.slice(0, 5)
        }}
      />
    </Layout>
  );
};

export default App;
