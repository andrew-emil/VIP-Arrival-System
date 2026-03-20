import api from "@/lib/api";
import { CreateVipDto, MutationVipResponse, UpdateVipDto } from "./types";

export async function createVip(dto: CreateVipDto) {
    try {
        const { data } = await api.post<MutationVipResponse>("/vip", dto);
        return data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

export async function updateVip(id: string, dto: UpdateVipDto) {
    try {
        const { data } = await api.patch<MutationVipResponse>(`/vip/${id}`, dto);
        return data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

export async function deleteVip(id: string) {
    try {
        await api.delete(`/vip/${id}`);
    } catch (error) {
        throw error?.response?.data || error;
    }
}
