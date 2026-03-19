import api from "@/lib/api";
import { CreateVipDto, CreateVipResponse } from "./types";

export async function createVip(dto: CreateVipDto) {
    try {
        const { data } = await api.post<CreateVipResponse>("/vip", dto);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function updateVip(id: string, dto: any) {
    try {
        const { data } = await api.patch(`/vip/${id}`, dto);
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function deleteVip(id: string) {
    try {
        await api.delete(`/vip/${id}`);
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}
