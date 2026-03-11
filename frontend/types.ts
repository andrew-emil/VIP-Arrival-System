
export type VipStatus = 'APPROACHING' | 'ARRIVED' | 'CLEARED' | 'ISSUE';
export type CameraStatus = 'ONLINE' | 'OFFLINE' | 'WARNING';
export type NotificationSeverity = 'info' | 'warn' | 'critical';
export type UserRole = 'Admin' | 'Operator' | 'Protocol' | 'Security';

export interface AppPermissions {
  live_ops: boolean;
  vip_directory: boolean;
  cameras_health: boolean;
  events_log: boolean;
  structure_manage: boolean;
  users_manage: boolean;
  settings_edit: boolean;
}

export interface Role {
  id: UserRole;
  nameAr: string;
  nameEn: string;
  permissions: AppPermissions;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Disabled';
  createdAt: string;
}

export interface Zone {
  id: string;
  nameAr: string;
  nameEn: string;
  description?: string;
}

export interface Gate {
  id: string;
  zoneId: string;
  nameAr: string;
  nameEn: string;
}

export interface VIP {
  id: string;
  plateText: string;
  fullName: string;
  priority: 'Gold' | 'Platinum' | 'Diamond';
  note: string;
  status: VipStatus;
  assignedEscort?: string;
}

export interface Camera {
  id: string;
  gateId: string;
  name: string;
  location: string;
  status: CameraStatus;
  lastSeenAt: string;
  latencyMs: number;
  avgConfidence: number;
  streamUrl?: string;
  mode: 'STRICT' | 'LENIENT';
}

export interface ArrivalEvent {
  id: string;
  timestamp: string;
  plateText: string;
  confidence: number;
  cameraName: string;
  location: string;
  status: 'APPROACHING' | 'ARRIVED';
  isVip: boolean;
  vipInfo?: VIP;
  imageUrl?: string;
  rawPayload?: any;
}

export interface NotificationItem {
  id: string;
  type: 'VIP_APPROACHING' | 'VIP_ARRIVED' | 'CAMERA_OFFLINE' | 'LOW_CONFIDENCE' | 'SYSTEM';
  titleAr: string;
  titleEn: string;
  messageAr: string;
  messageEn: string;
  severity: NotificationSeverity;
  createdAt: string;
  isRead: boolean;
  isPinned: boolean;
  vipId?: string;
  cameraId?: string;
}

// Added missing interface for VIP action logging
export interface VipActionLog {
  id: string;
  vipId: string;
  actionType: string;
  actor: string;
  createdAt: string;
}

export interface AppSettings {
  language: 'ar' | 'en';
  theme: 'light' | 'dark';
  soundAlerts: boolean;
  timezone: string;
  uiDensity: 'comfortable' | 'compact';
  glowIntensity: 'low' | 'medium' | 'high';
  notifs: {
    vip: boolean;
    system: boolean;
    confidence: boolean;
  };
}
