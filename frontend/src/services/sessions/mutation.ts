import api from "@/lib/api";
import { ISession } from "./types";

export async function confirmSession(id: string) {
    try {
        const { data } = await api.patch<ISession>(`/sessions/${id}/confirm`);
        return data;
    } catch (error: any) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function completeSession(id: string) {
    try {
        const { data } = await api.patch<ISession>(`/sessions/${id}/complete`);
        return data;
    } catch (error: any) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function rejectSession(id: string) {
    try {
        const { data } = await api.patch<ISession>(`/sessions/${id}/reject`);
        return data;
    } catch (error: any) {
        throw error?.response?.data?.message || error.message;
    }
}