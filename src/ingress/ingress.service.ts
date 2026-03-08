import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { normalizePlate } from '../core/utils/plate-normalizer';
import { logInfo } from '../core/logger/app-logger';

@Injectable()
export class IngressService {
    constructor(private readonly prisma: PrismaService) { }

    async handlePlateRead(rawPayload: any, req: any) {
        const requestId = req?.requestId;

        logInfo({
            requestId,
            route: 'POST /ingress/plate-reads',
            event: 'request_received',
        });

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

        const idempotencyKey =
            rawPayload.idempotencyKey ??
            rawPayload.idempotency_key ??
            `${cameraId}-${Date.now()}`;

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

        let timestamp_date: Date;
        if (timestamp) {
            const parsed = new Date(timestamp);
            if (isNaN(parsed.getTime())) {
                throw new BadRequestException({
                    message: 'Validation failed',
                    details: [{ field: 'timestamp', issue: 'invalid' }],
                });
            }
            timestamp_date = parsed;
        } else {
            timestamp_date = new Date();
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
           4) Normalize + match VIP (via Plate)
           ----------------------------- */
        const plateNormalized = normalizePlate(plate);

        const matchedPlate = await this.prisma.plate.findUnique({
            where: { plateNumber: plateNormalized },
            include: { vip: true },
        });

        const isVip = Boolean(matchedPlate?.vip);

        /* -----------------------------
           5) Persist PlateEvent
           ----------------------------- */
        const plateEvent = await this.prisma.plateEvent.create({
            data: {
                plate: plateNormalized,
                cameraId,
                timestamp: timestamp_date,
                idempotencyKey,
                confidence,
                isLate: false,
                eventId: camera.eventId!,
            },
        });

        logInfo({
            requestId,
            route: 'POST /ingress/plate-reads',
            plateEventId: plateEvent.id,
            isVip,
        });

        /* -----------------------------
           6) Audit log
           ----------------------------- */
        await this.prisma.auditLog.create({
            data: {
                action: 'PLATE_READ_RECEIVED',
                meta: {
                    plateEventId: plateEvent.id,
                    plateNormalized,
                    isVip,
                },
            },
        });

        /* -----------------------------
           7) Response (201)
           ----------------------------- */
        return {
            id: plateEvent.id,
            plate: plateEvent.plate,
            cameraId: plateEvent.cameraId,
            timestamp: plateEvent.timestamp,
            isVip,
        };
    }
}

