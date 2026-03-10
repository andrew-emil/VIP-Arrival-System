import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RealtimeService } from '../realtime/realtime.service';
import { RealtimeEvent } from '../realtime/realtime.enums';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateVipDto } from './dto/createVip.dto';
import { normalizePlate } from 'src/core/utils/plate-normalizer';
import { CameraRole, SessionStatus } from '@prisma/client';

@Injectable()
export class VipService {
    private readonly logger = new Logger(VipService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly realtimeService: RealtimeService,
    ) { }

    async create(createVipDto: CreateVipDto) {
        const { plate, name } = createVipDto;
        if (!plate) throw new BadRequestException('plate is required');

        const plateNormalized = normalizePlate(plate);

        const existingVip = await this.prisma.vip.findFirst({
            where: { plates: { some: { plateNumber: plateNormalized } } },
        });

        if (existingVip) {
            throw new ConflictException('VIP already exists for this plate');
        }

        const activeEvent = await this.prisma.event.findFirst();
        if (!activeEvent) {
            throw new ConflictException('No active event found to assign VIP');
        }

        const vip = await this.prisma.vip.create({
            data: {
                name: name?.trim() ?? 'Unknown',
                eventId: activeEvent.id,
                plates: {
                    create: { plateNumber: plateNormalized },
                },
            },
            include: { plates: true },
        });

        this.realtimeService.emit(RealtimeEvent.VIP_ADDED, { id: vip.id, name: vip.name, plate: plateNormalized });
        return vip;
    }

    async listVips(plate?: string) {
        const where = plate
            ? {
                plates: {
                    some: {
                        plateNumber: {
                            contains: normalizePlate(plate),
                        },
                    },
                },
            }
            : undefined;

        const items = await this.prisma.vip.findMany({
            where,
            include: { plates: true },
            take: 200,
        });

        return {
            items: items.map((v) => ({
                id: v.id,
                plateNormalized: v.plates.length > 0 ? v.plates[0].plateNumber : 'UNKNOWN',
                name: v.name,
            })),
        };
    }

    async createSessionIfNotExists(vipId: string, eventId: string) {
        const active = await this.prisma.vipSession.findFirst({
            where: { vipId, eventId, status: { not: SessionStatus.COMPLETED } },
        });
        if (active) return active;

        return this.prisma.vipSession.create({
            data: {
                vipId,
                eventId,
                status: SessionStatus.REGISTERED,
            },
        });
    }

    // call this for each new PlateEvent (camera is included)
    async handlePlateEvent(plateEvent: any, camera: any) {
        const plate = plateEvent.plate;
        if (!plate) return;

        // find plate -> VIP
        const matchedPlate = await this.prisma.plate.findUnique({
            where: { plateNumber: plate },
            include: { vip: true },
        });

        const vip = matchedPlate?.vip;
        if (!vip) return; // not a VIP, nothing to do

        // event + late handling: if plateEvent outside event window, mark late and stop
        const event = await this.prisma.event.findUnique({ where: { id: plateEvent.eventId } });
        if (!event) {
            this.logger.warn(`PlateEvent ${plateEvent.id} references unknown event ${plateEvent.eventId}`);
            return;
        }

        const ts = new Date(plateEvent.timestamp);
        if (ts < event.startTime || ts > event.endTime) {
            await this.prisma.plateEvent.update({ where: { id: plateEvent.id }, data: { isLate: true } });
            await this.prisma.auditLog.create({ data: { action: 'PLATE_READ_LATE', meta: { plateEventId: plateEvent.id } } });
            return; // do NOT alert or progress FSM
        }

        // ensure session exists
        let session = await this.prisma.vipSession.findFirst({
            where: { vipId: vip.id, eventId: event.id, status: { not: SessionStatus.COMPLETED } },
            orderBy: { createdAt: 'desc' },
        });

        if (!session) {
            session = await this.createSessionIfNotExists(vip.id, event.id);
        }

        // apply transition based on camera.role
        const role: CameraRole = camera.role;
        await this.applyTransition(session, role, plateEvent);
    }

    /**
   * Guarded state transitions using the Camera role.
   */
    async applyTransition(session: any, cameraRole: CameraRole, plateEvent: any) {
        const current = session.status as SessionStatus;

        let nextState: SessionStatus | null = null;

        if (cameraRole === CameraRole.APPROACH) {
            if (current === SessionStatus.REGISTERED) nextState = SessionStatus.APPROACHING;
        } else if (cameraRole === CameraRole.GATE) {
            if (current === SessionStatus.APPROACHING) nextState = SessionStatus.ARRIVED;
        }

        // staff confirmation is an external action (ARRIVED -> CONFIRMED)
        if (!nextState) return;

        const data: any = { status: nextState };
        if (nextState === SessionStatus.APPROACHING) data.approachAt = new Date();
        if (nextState === SessionStatus.ARRIVED) data.arrivedAt = new Date();

        await this.prisma.vipSession.update({
            where: { id: session.id },
            data,
        });

        this.logger.log(
            `VIPSession ${session.id} ${current} → ${nextState}`
        );

        await this.prisma.auditLog.create({
            data: {
                action: 'VIPSESSION_TRANSITION',
                meta: {
                    sessionId: session.id,
                    from: current,
                    to: nextState,
                    byCamera: plateEvent.cameraId,
                },
            },
        });

        this.realtimeService.emit(nextState === SessionStatus.ARRIVED ? RealtimeEvent.VIP_ARRIVED : RealtimeEvent.VIP_STATUS_CHANGED, {
            sessionId: session.id,
            vipId: session.vipId,
            name: session.vip?.name,
            plate: plateEvent.plate,
            from: current,
            to: nextState,
            cameraId: plateEvent.cameraId
        });
    }

    /**
   * Called by staff UI to confirm ARRIVED -> CONFIRMED
   */
    async confirmSession(sessionId: string, confirmedByUserId: string) {
        const s = await this.prisma.vipSession.findUnique({ where: { id: sessionId } });
        if (!s) throw new NotFoundException('Session not found');

        if (s.status === SessionStatus.COMPLETED || s.status === SessionStatus.CONFIRMED) {
            throw new ConflictException(`Session is already ${s.status}, cannot confirm again`);
        }

        await this.prisma.vipSession.update({
            where: { id: sessionId },
            data: { status: SessionStatus.CONFIRMED, confirmedAt: new Date(), confirmedBy: confirmedByUserId },
        });

        await this.prisma.auditLog.create({
            data: { action: 'VIPSESSION_CONFIRMED', meta: { sessionId, by: confirmedByUserId } },
        });

        this.realtimeService.emit(RealtimeEvent.VIP_CONFIRMED, { sessionId, confirmedBy: confirmedByUserId });
    }
}
