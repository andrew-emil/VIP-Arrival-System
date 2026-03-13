import api from "@/lib/api";
import { CreateEventDto, UpdateEventDto, IEvent } from "./types";

export async function createEvent(dto: CreateEventDto) {
    try {
        const { data } = await api.post<IEvent>("/events", dto);
        return data;
    } catch (error: any) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function updateEvent(id: string, dto: UpdateEventDto) {
    try {
        const { data } = await api.patch<IEvent>(`/events/${id}`, dto);
        return data;
    } catch (error: any) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function deleteEvent(id: string) {
    try {
        await api.delete(`/events/${id}`);
    } catch (error: any) {
        throw error?.response?.data?.message || error.message;
    }
}
