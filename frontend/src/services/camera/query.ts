import api from "@/lib/api";
import { ICamera, ICameraHealth } from "./types";

export async function getCameras() {
    try {
        const { data } = await api.get<ICamera[]>("/camera");
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function getCameraById(id: string) {
    try {
        const { data } = await api.get<ICamera>(`/camera/${id}`);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}
export async function getCameraHealth() {
    try {
        const { data } = await api.get<ICameraHealth[]>("/camera/health");
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}