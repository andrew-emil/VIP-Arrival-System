import api from "@/lib/api";
import { CreateVipDto, CreateVipResponse } from "./types";

export async function createVip(dto: CreateVipDto) {
    try {
        const { data } = await api.post<CreateVipResponse>("/vip", dto);
        return data;
    } catch (error: any) {
        throw error?.response?.data?.message || error.message;
    }
}
