import api from "@/lib/api";

export async function generateRealtimeTicket() {
    try {
        const { data } = await api.post<{ ticket: string }>("/realtime/ticket");
        return data.ticket;
    } catch (error: any) {
        throw error?.response?.data?.message || error.message;
    }
}

export function connectRealtimeStream(ticket: string) {
    const url = `${import.meta.env.VITE_API_URL}/realtime/stream?ticket=${ticket}`;

    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log("Realtime event:", data);
    };

    eventSource.onerror = (error) => {
        console.error("SSE connection error:", error);
        eventSource.close();
    };

    return eventSource;
}
