export interface CreateDeviceDto {
    name: string;
    cameraId: string;
}

export type UpdateDeviceDto = Partial<CreateDeviceDto>

export interface IDevice {
    id: string;
    cameraId: string;
    deviceId: string;
    name: string;
    temporaryPassword: string | null;
    isActive: boolean;
    createdAt: Date;
}

export interface ICamera {
    id: string;
    eventId: string;
    name: string;
    location: string | null;
    ip: string;
    role: CameraRole;
    lastSeen: Date | null;
}

export enum CameraRole {
    APPROACH = 'APPROACH',
    GATE = 'GATE',
}

export interface FindDeviceRes extends IDevice {
    camera: ICamera;
}