import api from "@/lib/api";
import { CreateCameraDto, ICamera, UpdateCameraDto } from "./types";

export async function createCamera(dto: CreateCameraDto) {
    try {
        const { data } = await api.post<ICamera>("/camera", dto);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function updateCamera(id: string, dto: UpdateCameraDto) {
    try {
        const { data } = await api.patch<ICamera>(`/camera/${id}`, dto);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function deleteCamera(id: string) {
    try {
        await api.delete(`/camera/${id}`);
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}