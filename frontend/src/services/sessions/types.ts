import { IVip } from "../vip/types";

export interface ISession {
    id: string;
    eventId: string;
    vip: IVip;
    vipId: string;
    status: SessionStatus;
    approachAt: Date | null;
    arrivedAt: Date | null;
    confirmedAt: Date | null;
    completedAt: Date | null;
    rejectedAt: Date | null;
    confirmedBy: string | null;
    completedBy: string | null;
    rejectedBy: string | null;
    createdAt: Date;
}

export enum SessionStatus {
    REGISTERED = "REGISTERED",
    APPROACHING = "APPROACHING",
    ARRIVED = "ARRIVED",
    CONFIRMED = "CONFIRMED",
    COMPLETED = "COMPLETED",
    REJECTED = "REJECTED"
}