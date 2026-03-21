import { Role } from "../users";

export interface ILoginDto {
    email: string;
    password: string;
}

export interface ILoginResponse {
    id: string;
    name: string;
    email: string;
    role: Role
}

export interface IDeviceLoginDto {
    deviceId: string;
    password: string;
}

export interface IDeviceLoginResponse {
    deviceId: string;
    name: string;
    cameraId: string;
    cameraLabel: string;
}