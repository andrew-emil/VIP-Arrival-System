import api from "@/lib/api";
import { GetAllVipsResponse } from "./types";

export async function getVips(plate?: string) {
    try {
        const { data } = await api.get<GetAllVipsResponse>("/vip", {
            params: { plate },
        });
        return data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}