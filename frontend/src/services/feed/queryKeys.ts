import { IFeedQueryOptions } from "./types";

export const FeedQueryKeys = {
    find: (options: IFeedQueryOptions) => ['feed', 'find', options] as const,
}