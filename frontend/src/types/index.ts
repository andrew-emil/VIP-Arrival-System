export type UserRole = 'admin' | 'operator' | 'manager' | 'gate';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
}

export type ProtocolLevel = 'A' | 'B' | 'C' | 'D';

export interface VIP {
  id: string;
  name: string;
  company: string;
  protocolLevel: ProtocolLevel;
  plateNumbers: string[];
  notes: string;
  photo?: string;
}

export type AlertStatus = `${RealtimeEvent}`;

//! needed
export interface Alert {
  id: string;
  vipId: string;
  vipName: string;
  plateNumber: string;
  protocolLevel: ProtocolLevel;
  cameraName: string;
  cameraId: string;
  status: AlertStatus;
  timestamp: string;
  snapshot?: string;
  company: string;
  vipPhoto?: string;
}

export type CameraRole = 'approach' | 'gate';

export interface Camera {
  id: string;
  name: string;
  location: string;
  role: CameraRole;
  lastSeen: string;
  isOnline: boolean;
}

export type EventStatus = 'draft' | 'active' | 'completed';

export interface VASEvent {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  status: EventStatus;
  vipIds: string[];
}

export type SSEEventType = 'ALERT_CREATED' | 'VIP_ARRIVED' | 'VIP_CONFIRMED' | 'CAMERA_HEALTH';

export enum RealtimeEvent {
  ALERT_CREATED = 'ALERT_CREATED',
  VIP_ARRIVED = 'VIP_ARRIVED',
  VIP_ADDED = 'VIP_ADDED',
  VIP_CONFIRMED = 'VIP_CONFIRMED',
  VIP_COMPLETED = 'VIP_COMPLETED',
  CAMERA_HEALTH = 'CAMERA_HEALTH',
  VIP_STATUS_CHANGED = 'VIP_STATUS_CHANGED',
  VIP_REJECTED = 'VIP_REJECTED',
}
