/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/api";
import { IIngress } from "./types";

export async function sendPlateRead(body: any) {
    try {
        const { data } = await api.post<IIngress>("/ingress/plate-reads", body);
        return data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}

export async function sendWebhookEvent(body: any) {
    try {
        const { data } = await api.post<{ status: string }>("/ingress/webhook", body);
        return data;
    } catch (error) {
        throw error?.response?.data || error;
    }
}
