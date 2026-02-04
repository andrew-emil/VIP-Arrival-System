import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';

interface FeedQuery {
    since?: string;
    limit?: string;
    isVip?: string;
}

@Injectable()
export class FeedService {
    constructor(private readonly prisma: PrismaService) { }

    async getFeed(query: FeedQuery) {
        const limit = query.limit ? Number(query.limit) : 50;

        if (isNaN(limit) || limit <= 0 || limit > 200) {
            throw new BadRequestException('Invalid limit (max 200)');
        }

        let sinceDate: Date | undefined;
        if (query.since) {
            const d = new Date(query.since);
            if (isNaN(d.getTime())) {
                throw new BadRequestException('Invalid since date');
            }
            sinceDate = d;
        }

        let isVipFilter: boolean | undefined;
        if (query.isVip !== undefined) {
            if (query.isVip !== 'true' && query.isVip !== 'false') {
                throw new BadRequestException('Invalid isVip value');
            }
            isVipFilter = query.isVip === 'true';
        }

        const records = await this.prisma.plateRead.findMany({
            where: {
                ...(sinceDate && { receivedAt: { gt: sinceDate } }),
                ...(isVipFilter !== undefined && { isVip: isVipFilter }),
            },
            orderBy: {
                receivedAt: 'desc',
            },
            take: limit + 1,
        });

        const hasMore = records.length > limit;
        const items = hasMore ? records.slice(0, limit) : records;

        const nextSince =
            items.length > 0 ? items[items.length - 1].receivedAt : null;

        return {
            items,
            hasMore,
            nextSince,
        };
    }
}
