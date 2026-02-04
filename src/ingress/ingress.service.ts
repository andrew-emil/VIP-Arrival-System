import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CameraSource, MatchType } from '@prisma/client';
import { PrismaService } from '../core/prisma/prisma.service';
import { normalizePlate } from '../core/utils/plate-normalizer';


@Injectable()
export class IngressService {
    constructor(private readonly prisma: PrismaService) { }

    async handlePlateRead(rawPayload: any) {
        /* -----------------------------
       1) Webhook mapping (ORDERED)
       ----------------------------- */
        const plate =
            rawPayload.plate ??
            rawPayload.plate_text;

        const timestamp =
            rawPayload.timestamp ??
            rawPayload.readAt ??
            rawPayload.captured_at;

        const cameraId =
            rawPayload.cameraId ??
            rawPayload.camera_id;

        const confidence =
            rawPayload.confidence ??
            rawPayload.score;

        const snapshotUrl =
            rawPayload.snapshotUrl ??
            rawPayload.image_url;

        /* -----------------------------
       2) Validation
       ----------------------------- */
        if (!plate || typeof plate !== 'string' || plate.trim() === '') {
            throw new BadRequestException({
                message: 'Validation failed',
                details: [{ field: 'plate', issue: 'missing' }],
            });
        }

        if (!cameraId || typeof cameraId !== 'string') {
            throw new BadRequestException({
                message: 'Validation failed',
                details: [{ field: 'cameraId', issue: 'missing' }],
            });
        }

        let readAt: Date;
        if (timestamp) {
            const parsed = new Date(timestamp);
            if (isNaN(parsed.getTime())) {
                throw new BadRequestException({
                    message: 'Validation failed',
                    details: [{ field: 'timestamp', issue: 'invalid' }],
                });
            }
            readAt = parsed;
        } else {
            readAt = new Date();
        }

        /* -----------------------------
           3) Strict camera check
           ----------------------------- */
        const camera = await this.prisma.camera.findUnique({
            where: { id: cameraId },
        });

        if (!camera)
            throw new NotFoundException('Camera not found');


        /* -----------------------------
           4) Normalize + match VIP
           ----------------------------- */
        const plateNormalized = normalizePlate(plate);

        const vip = await this.prisma.vip.findFirst({
            where: {
                plateNormalized,
                active: true,
            },
        });

        const isVip = Boolean(vip);
        const matchType = vip ? MatchType.exact : MatchType.none;

        /* -----------------------------
           5) Persist PlateRead
           ----------------------------- */
        const plateRead = await this.prisma.plateRead.create({
            data: {
                plateRaw: plate,
                plateNormalized,
                cameraId,
                readAt,
                receivedAt: new Date(),
                confidence,
                snapshotUrl,
                source: CameraSource.webhook,
                isVip,
                matchType,
                vipId: vip?.id ?? null,
                rawPayload,
            },
        });

        /* -----------------------------
           6) Audit logs (3 events)
           ----------------------------- */
        await this.prisma.auditLog.createMany({
            data: [
                { plateReadId: plateRead.id, eventType: 'received' },
                { plateReadId: plateRead.id, eventType: 'normalized' },
                { plateReadId: plateRead.id, eventType: 'matched' },
            ],
        });

        /* -----------------------------
           7) Response (201)
           ----------------------------- */
        return {
            id: plateRead.id,
            plateRaw: plateRead.plateRaw,
            plateNormalized: plateRead.plateNormalized,
            cameraId: plateRead.cameraId,
            receivedAt: plateRead.receivedAt,
            isVip: plateRead.isVip,
            matchType: plateRead.matchType,
        };
    }
}
