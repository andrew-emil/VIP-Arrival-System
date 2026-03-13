import api from "@/lib/api";
import { IEvent } from "./types";

export async function getEvents() {
    try {
        const { data } = await api.get<IEvent[]>("/events");
        return data;
    } catch (error: any) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function getActiveEvents() {
    try {
        const { data } = await api.get<IEvent[]>("/events/active");
        return data;
    } catch (error: any) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function getEventById(id: string) {
    try {
        const { data } = await api.get<IEvent>(`/events/${id}`);
        return data;
    } catch (error: any) {
        throw error?.response?.data?.message || error.message;
    }
}
