import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RealtimeService } from 'src/realtime/realtime.service';
import { RealtimeEvent } from 'src/realtime/realtime.enums';
import { Prisma } from '@prisma/client';
import { logInfo } from '../core/logger/app-logger';
import { PrismaService } from '../core/prisma/prisma.service';
import { normalizePlate } from '../core/utils/plate-normalizer';
import { IdempotencyService } from '../idempotency/idempotency.service';
import { VipService } from '../vip/vip.service';

@Injectable()
export class IngressService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly idempotencyService: IdempotencyService,
        private readonly vipService: VipService,
        private readonly realtimeService: RealtimeService,
    ) { }

    async handlePlateRead(rawPayload: any, req: any) {
        const requestId = req?.requestId;
        logInfo({ requestId, route: 'POST /ingress/plate-reads', event: 'request_received' });

        const { plate, timestamp, cameraId, confidence, eventId, idempotencyKey } = this.extractFields(rawPayload, req);

        if (!plate || typeof plate !== 'string' || plate.trim() === '') {
            throw new BadRequestException({ message: 'Validation failed', details: [{ field: 'plate', issue: 'missing' }] });
        }
        if (!cameraId || typeof cameraId !== 'string') {
            throw new BadRequestException({ message: 'Validation failed', details: [{ field: 'cameraId', issue: 'missing' }] });
        }

        return this.processPlateRead({
            plate,
            cameraId,
            timestamp: timestamp ? new Date(timestamp) : new Date(),
            eventId,
            confidence,
            idempotencyKey,
            requestId,
            route: 'POST /ingress/plate-reads'
        });
    }

    async handleCameraEvent(camera: any, event: any) {
        return this.processPlateRead({
            plate: event.plate,
            cameraId: camera.id,
            timestamp: event.timestamp ? new Date(event.timestamp) : new Date(),
            eventId: camera.eventId,
            idempotencyKey: event.idempotencyKey ?? event.idempotency_key ?? event.event_id,
            camera,
            route: 'POST /ingress/webhook'
        });
    }

    private extractFields(rawPayload: any, req: any) {
        return {
            plate: rawPayload.plate ?? rawPayload.plate_text,
            timestamp: rawPayload.timestamp ?? rawPayload.readAt ?? rawPayload.captured_at,
            cameraId: rawPayload.cameraId ?? rawPayload.camera_id ?? (req.camera?.id as string),
            confidence: rawPayload.confidence ?? rawPayload.score,
            eventId: rawPayload.eventId ?? rawPayload.event_id ?? req.camera?.eventId,
            idempotencyKey: rawPayload.idempotencyKey ?? rawPayload.idempotency_key,
        };
    }

    private async processPlateRead(data: {
        plate: string;
        cameraId: string;
        timestamp: Date;
        eventId: string;
        confidence?: number;
        idempotencyKey?: string;
        requestId?: string;
        camera?: any;
        route?: string;
    }) {
        const { plate, cameraId, timestamp, eventId, confidence, idempotencyKey, requestId, route } = data;
        const normalized = normalizePlate(plate);

        // Consistent key generation via service
        const key = idempotencyKey || this.idempotencyService.makeKey(eventId, cameraId, normalized, timestamp);

        const duplicate = await this.idempotencyService.checkAndStore(key, 10);
        if (duplicate) {
            logInfo({ requestId, route, event: 'duplicate', idempotencyKey: key });
            return { status: 'ok', duplicate: true };
        }

        const camera = data.camera || await this.prisma.camera.findUnique({ where: { id: cameraId } });
        if (!camera) throw new NotFoundException('Camera not found');

        const matched = await this.prisma.plate.findUnique({ where: { plateNumber: normalized }, include: { vip: true } });
        const isVip = Boolean(matched?.vip);

        try {
            const plateEvent = await this.prisma.plateEvent.create({
                data: {
                    plate: normalized,
                    cameraId,
                    timestamp,
                    idempotencyKey: key,
                    confidence,
                    isLate: false,
                    eventId: eventId || camera.eventId,
                },
            });

            await this.vipService.handlePlateEvent(plateEvent, camera);

            logInfo({ requestId, route, plateEventId: plateEvent.id, isVip });

            await this.prisma.auditLog.create({
                data: { action: 'PLATE_READ_RECEIVED', meta: { plateEventId: plateEvent.id, plateNormalized: normalized, isVip } },
            });

            return {
                id: plateEvent.id,
                plate: plateEvent.plate,
                cameraId: plateEvent.cameraId,
                timestamp: plateEvent.timestamp,
                isVip,
            };
        } catch (err) {
            if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
                logInfo({ requestId, route, event: 'db_unique_violation', key });
                return { status: 'ok', duplicate: true };
            }
            throw err;
        } finally {
            if (!isVip) {
                this.realtimeService.emit(RealtimeEvent.ALERT_CREATED, {
                    plate: normalized,
                    cameraId,
                    timestamp,
                    confidence
                });
            }
        }
    }
}