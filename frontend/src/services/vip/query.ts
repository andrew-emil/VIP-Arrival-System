import api from "@/lib/api";
import { IVip } from "./types";

export async function getVips(plate?: string) {
    try {
        const { data } = await api.get<IVip[]>("/vip", {
            params: { plate },
        });
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}