import api from "@/lib/api";
import { IFeed, IFeedQueryOptions } from "./types";

export async function findFeed(options: IFeedQueryOptions): Promise<IFeed> {
    try {
        const { data } = await api.
            get<IFeed>(`/feed?isVip=${options.isVip}&since=${options.since?.toISOString()}&limit=${options.limit}`)
        return data;
    } catch (error) {
        throw error?.response?.data?.message || error.message;
    }
}