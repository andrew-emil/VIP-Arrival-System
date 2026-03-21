import { SessionStatus } from '@/services/sessions';

export type UserRole = 'admin' | 'operator' | 'manager' | 'observer' | 'gate_guard';
export type ProtocolLevel = 'A' | 'B' | 'C' | 'D';
export type SSEEventType = 'ALERT_CREATED' | 'VIP_ARRIVED' | 'VIP_CONFIRMED' | 'CAMERA_HEALTH';
export type EventStatus = 'draft' | 'active' | 'completed';
export type AlertStatus = `${RealtimeEvent}` | SessionStatus;

export interface Alert {
  id: string;
  vipId: string;
  vipName: string;
  plateNumber: string;
  protocolLevel: ProtocolLevel;
  cameraName?: string;
  cameraId?: string;
  status: AlertStatus;
  timestamp: string;
  snapshot?: string;
  company: string;
  vipPhoto?: string;
}

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

export interface VASEvent {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  status: EventStatus;
  vipIds: string[];
}