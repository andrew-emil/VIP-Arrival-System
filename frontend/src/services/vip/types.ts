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
    plate?: string
    name: string;
}

export interface MutationVipResponse {
    id: string;
    name: string;
    plate: string;
    retroMatchedEvents: number;
}

export interface UpdateVipDto extends CreateVipDto {
    company?: string;
    protocolLevel?: string;
    notes?: string;
    photoUrl?: string;
    plateNumbers?: string[];
}

export interface VipPlate {
    id: string;
    plateNumber: string;
    vipId: string;
}

export interface VipItem extends IVip {
    plateNormalized: string;
    plates: VipPlate[];
}

export type GetAllVipsResponse = VipItem[];