import api from "@/lib/api";
import { CreateDeviceDto, IDevice, UpdateDeviceDto } from "./types";

export async function createDevice(dto: CreateDeviceDto) {
    try {
        const { data } = await api.post<IDevice>('/devices', dto);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function updateDevice(id: string, dto: UpdateDeviceDto) {
    try {
        const { data } = await api.patch<IDevice>(`/devices/${id}`, dto);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function deleteDevice(id: string) {
    try {
        await api.delete(`/devices/${id}`);
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function deactivateDevice(id: string) {
    try {
        const { data } = await api.patch<IDevice>(`/devices/${id}/deactivate`);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function regeneratePassword(id: string) {
    try {
        const { data } = await api.patch<IDevice>(`/devices/${id}/regenerate-password`);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}