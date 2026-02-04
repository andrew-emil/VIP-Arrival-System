import { BadRequestException, Injectable } from '@nestjs/common';
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
        let limit = query.limit ? Number(query.limit) : 50;

        if (isNaN(limit) || limit <= 0) {
            throw new BadRequestException('Invalid limit');
        }
        if (limit > 200) {
            limit = 200;
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
            take: limit,
        });

        /* -----------------------------
       5) Response mapping
       ----------------------------- */
        const items = records.map((r) => ({
            id: r.id,
            plate: r.plateNormalized,
            timestamp: r.readAt,
            cameraId: r.cameraId,
            isVip: r.isVip,
            confidence: r.confidence,
            receivedAt: r.receivedAt,
        }));

        const nextSince =
            items.length > 0 ? items[items.length - 1].receivedAt : null;

        return {
            items,
            nextSince,
        };

    }
}
