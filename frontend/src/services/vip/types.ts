export interface IVip {
    id: string;
    eventId: string;
    name: string;
    company: string | null;
    protocolLevel: string | null;
    notes: string | null;
    photoUrl: string | null;
    createdAt: Date;
}

export interface CreateVipDto {
    name: string;
    plate?: string
}

export interface CreateVipResponse {
    id: string;
    name: string;
    plate: string;
    retroMatchedEvents: number;
}

export interface GetAllVipsResponse {
    items: {
        id: string;
        plateNormalized: string;
        name: string;
    }[]
}