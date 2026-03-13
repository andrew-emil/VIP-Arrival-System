import api from "@/lib/api";
import { ISession } from "./types";

export async function getSessions() {
    try {
        const { data } = await api.get<ISession[]>("/sessions");
        return data;
    } catch (error: any) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function getArrivedSessions() {
    try {
        const { data } = await api.get<ISession[]>("/sessions/arrived");
        return data;
    } catch (error: any) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function getSessionById(id: string) {
    try {
        const { data } = await api.get<ISession>(`/sessions/${id}`);
        return data;
    } catch (error: any) {
        throw error?.response?.data?.message || error.message;
    }
}