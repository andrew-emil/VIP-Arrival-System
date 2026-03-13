import { ICamera } from "../devices";

export interface IFeed {
    items: {
        id: string;
        plate: string;
        timestamp: Date;
        cameraId: string;
        camera: Pick<ICamera, 'name' | 'id' | 'role'>;
        confidence: number | null;
        isLate: boolean;
        receivedAt: Date;
    }[];
    nextSince: Date | null;
}

export interface IFeedQueryOptions {
    isVip?: boolean;
    since?: Date;
    limit?: number;
}