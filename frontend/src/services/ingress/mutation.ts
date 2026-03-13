import api from "@/lib/api";
import { IIngress } from "./types";

export async function sendPlateRead(body: any) {
    try {
        const { data } = await api.post<IIngress>("/ingress/plate-reads", body);
        return data;
    } catch (error: any) {
        throw error?.response?.data?.message || error.message;
    }
}

export async function sendWebhookEvent(body: any) {
    try {
        const { data } = await api.post<{ status: string }>("/ingress/webhook", body);
        return data;
    } catch (error: any) {
        throw error?.response?.data?.message || error.message;
    }
}
