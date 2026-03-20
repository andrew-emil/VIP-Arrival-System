import api from "@/lib/api";
import { FindDeviceRes } from "./types";

export async function findDevice(id: string) {
    try {
        const { data } = await api.get<FindDeviceRes>(`/devices/${id}`);
        return data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

export async function findAllDevices() {
    try {
        const { data } = await api.get<FindDeviceRes[]>(`/devices`);
        return data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}