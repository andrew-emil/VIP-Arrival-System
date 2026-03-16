import { User, VIP, Camera, VASEvent, Alert } from '@/types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'أحمد المنصور', email: 'admin@vas.com', role: 'admin', isActive: true },
  { id: 'u2', name: 'خالد العتيبي', email: 'operator@vas.com', role: 'operator', isActive: true },
  { id: 'u3', name: 'فهد القحطاني', email: 'manager@vas.com', role: 'manager', isActive: true },
  { id: 'u4', name: 'سعد الشمري', email: 'gate@vas.com', role: 'gate', isActive: true },
];

export const mockVIPs: VIP[] = [
  { id: 'v1', name: 'الأمير محمد بن سلمان', company: 'الديوان الملكي', protocolLevel: 'A', plateNumbers: ['ABC 1234'], notes: 'بروتوكول أمني أقصى', photo: '' },
  { id: 'v2', name: 'م. عبدالله الرشيد', company: 'أرامكو السعودية', protocolLevel: 'A', plateNumbers: ['DEF 5678'], notes: 'رئيس تنفيذي', photo: '' },
  { id: 'v3', name: 'د. نورة الفيصل', company: 'نيوم', protocolLevel: 'B', plateNumbers: ['GHI 9012', 'JKL 3456'], notes: 'نائب رئيس', photo: '' },
  { id: 'v4', name: 'عمر الحربي', company: 'STC', protocolLevel: 'B', plateNumbers: ['MNO 7890'], notes: '', photo: '' },
  { id: 'v5', name: 'سارة المالكي', company: 'صندوق الاستثمارات العامة', protocolLevel: 'A', plateNumbers: ['PQR 1122'], notes: 'مستشار أول', photo: '' },
  { id: 'v6', name: 'طارق الدوسري', company: 'سابك', protocolLevel: 'C', plateNumbers: ['STU 3344'], notes: '', photo: '' },
  { id: 'v7', name: 'ليلى العنزي', company: 'هيئة الترفيه', protocolLevel: 'B', plateNumbers: ['VWX 5566'], notes: 'مديرة الفعاليات', photo: '' },
  { id: 'v8', name: 'راشد الغامدي', company: 'وزارة الداخلية', protocolLevel: 'A', plateNumbers: ['YZA 7788'], notes: 'بروتوكول خاص', photo: '' },
  { id: 'v9', name: 'فاطمة الزهراني', company: 'الهيئة الملكية', protocolLevel: 'C', plateNumbers: ['BCD 9900'], notes: '', photo: '' },
  { id: 'v10', name: 'ماجد السبيعي', company: 'مسك', protocolLevel: 'D', plateNumbers: ['EFG 1133'], notes: 'ضيف عام', photo: '' },
];

export const mockCameras: Camera[] = [
  { id: 'c1', name: 'كاميرا البوابة الرئيسية', location: 'المدخل الرئيسي', role: 'approach', lastSeen: new Date().toISOString(), isOnline: true },
  { id: 'c2', name: 'كاميرا الطريق السريع', location: 'طريق الملك فهد', role: 'approach', lastSeen: new Date().toISOString(), isOnline: true },
  { id: 'c3', name: 'كاميرا البوابة', location: 'بوابة الدخول', role: 'gate', lastSeen: new Date(Date.now() - 600000).toISOString(), isOnline: false },
];

export const mockEvents: VASEvent[] = [
  {
    id: 'e1',
    name: 'مؤتمر الاستثمار السعودي 2026',
    startTime: '2026-03-13T09:00:00',
    endTime: '2026-03-13T18:00:00',
    status: 'active',
    vipIds: ['v1', 'v2', 'v3', 'v4', 'v5'],
  },
  {
    id: 'e2',
    name: 'حفل افتتاح نيوم',
    startTime: '2026-03-20T19:00:00',
    endTime: '2026-03-20T23:00:00',
    status: 'draft',
    vipIds: ['v3', 'v7', 'v8'],
  },
];