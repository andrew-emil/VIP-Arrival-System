export type CameraRole = "APPROACH" | "GATE";

export interface ICamera {
    id: string;
    name: string;
    location?: string | null;
    ip: string;
    role: CameraRole;
    eventId: string;
    lastSeen?: Date | null;
}

export interface CreateCameraDto {
    name: string;
    location?: string;
    ip: string;
    role: CameraRole;
    eventId: string;
}

export type UpdateCameraDto = Partial<CreateCameraDto>

export interface ICameraHealth {
    id: string;
    name: string;
    ip: string;
    isOnline: boolean;
    lastSeen?: Date | null;
}