import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CameraRole } from '@prisma/client';
import { SessionStatus } from '@prisma/client';
import { CameraService } from 'src/camera/camera.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { RealtimeEvent } from 'src/realtime/realtime.enums';
import { RealtimeService } from 'src/realtime/realtime.service';

@Injectable()
export class SessionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly realtimeService: RealtimeService,
    private readonly cameraService: CameraService
  ) { }

  async getAllSessions() {
    return this.prisma.vipSession.findMany({
      include: {
        vip: true,
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  async getSessionById(sessionId: string) {
    const session = await this.prisma.vipSession.findUnique({ where: { id: sessionId }, include: { vip: true } });
    if (!session) throw new NotFoundException('Session not found');
    return session;
  }

  async getArrivedSessions() {
    return this.prisma.vipSession.findMany({
      where: {
        status: {
          in: [SessionStatus.ARRIVED, SessionStatus.APPROACHING]
        }
      },
      include: {
        vip: true,
      }
    })
  }

  async getArrivedSessionsByCameraId(cameraId: string) {
    const camera = await this.cameraService.findOneCamera(cameraId)

    return this.prisma.vipSession.findMany({
      where: {
        eventId: camera.eventId,
        status: {
          in: [SessionStatus.ARRIVED, SessionStatus.APPROACHING],
        },
      },
      include: {
        vip: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async confirmSession(sessionId: string, confirmedByUserId: string) {
    const s = await this.getSessionById(sessionId);

    if (s.status === SessionStatus.COMPLETED || s.status === SessionStatus.CONFIRMED) {
      throw new ConflictException(`Session is already ${s.status}, cannot confirm again`);
    }

    const updatedSession = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.vipSession.update({
        where: { id: sessionId },
        data: {
          status: SessionStatus.CONFIRMED,
          confirmedAt: new Date(),
          confirmedBy: confirmedByUserId
        },
      });

      await tx.auditLog.create({
        data: { action: 'SESSION_CONFIRMED', meta: { sessionId, by: confirmedByUserId } },
      });

      return updated
    })

    this.realtimeService.emit(RealtimeEvent.VIP_CONFIRMED, { sessionId, confirmedBy: confirmedByUserId });

    return updatedSession;
  }

  async completeSession(sessionId: string, completedByUserId: string) {
    const s = await this.getSessionById(sessionId);

    if (s.status === SessionStatus.COMPLETED) {
      throw new ConflictException('Session already completed');
    }

    const updatedSession = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.vipSession.update({
        where: { id: sessionId },
        data: {
          status: SessionStatus.COMPLETED,
          completedAt: new Date(),
          completedBy: completedByUserId
        },
      });

      await tx.auditLog.create({
        data: { action: 'SESSION_COMPLETED', meta: { sessionId, by: completedByUserId } },
      });

      return updated
    })

    this.realtimeService.emit(RealtimeEvent.VIP_COMPLETED, { sessionId, completedBy: completedByUserId });

    return updatedSession;
  }

  async rejectSession(sessionId: string, rejectedByUserId: string) {
    const s = await this.getSessionById(sessionId);

    if (
      s.status === SessionStatus.COMPLETED ||
      s.status === SessionStatus.CONFIRMED ||
      s.status === SessionStatus.REJECTED
    ) {
      throw new ConflictException(`Session already ${s.status}`);
    }

    const updatedSession = await this.prisma.$transaction(async (tx) => {

      const updated = await tx.vipSession.update({
        where: { id: sessionId },
        data: {
          status: SessionStatus.REJECTED,
          rejectedAt: new Date(),
          rejectedBy: rejectedByUserId
        },
      });

      await tx.auditLog.create({
        data: {
          action: 'SESSION_REJECTED',
          meta: { sessionId, by: rejectedByUserId },
        },
      });

      return updated;
    });

    this.realtimeService.emit(
      RealtimeEvent.VIP_REJECTED,
      { sessionId, rejectedBy: rejectedByUserId }
    );

    return updatedSession;
  }
}
