import api from "@/lib/api";
import { CreateEventDto, UpdateEventDto, IEvent } from "./types";

export async function createEvent(dto: CreateEventDto) {
    try {
        const { data } = await api.post<IEvent>("/events", dto);
        return data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

export async function updateEvent(id: string, dto: UpdateEventDto) {
    try {
        const { data } = await api.patch<IEvent>(`/events/${id}`, dto);
        return data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

export async function deleteEvent(id: string) {
    try {
        await api.delete(`/events/${id}`);
    } catch (error) {
        throw error?.response?.data || error;
    }
}
