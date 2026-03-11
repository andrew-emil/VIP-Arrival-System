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
            sinceDate = new Date(query.since);
            if (isNaN(sinceDate.getTime())) {
                throw new BadRequestException('Invalid since date');
            }
        }

        const records = await this.prisma.plateEvent.findMany({
            where: {
                ...(sinceDate && { createdAt: { gt: sinceDate } }),
            },
            include: {
                camera: { select: { id: true, name: true, role: true } },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: limit,
        });

        /* -----------------------------
           Response mapping
           ----------------------------- */
        const items = records.map((r) => ({
            id: r.id,
            plate: r.plate,
            timestamp: r.timestamp,
            cameraId: r.cameraId,
            camera: r.camera,
            confidence: r.confidence,
            isLate: r.isLate,
            receivedAt: r.createdAt,
        }));

        const nextSince =
            items.length > 0 ? items[items.length - 1].receivedAt : null;

        return {
            items,
            nextSince,
        };
    }
}

