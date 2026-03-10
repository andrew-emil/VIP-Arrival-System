import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class CameraService {
    constructor(private readonly prisma: PrismaService) { }

    async getCameraByIp(ip: string) {
        const camera = await this.prisma.camera.findUnique({
            where: { ip },
        });
        if (!camera) {
            throw new UnauthorizedException('Unknown camera');
        }

        return camera
    }

    async touchLastSeen(cameraId: string) {
        await this.prisma.camera.update({
            where: { id: cameraId },
            data: { lastSeen: new Date() },
        });
    }

    async getCameraHealth() {
        const cameras = await this.prisma.camera.findMany();
        const now = Date.now();

        return cameras.map(c => {
            const age = c.lastSeen
                ? now - c.lastSeen.getTime()
                : Infinity;
            return {
                id: c.id,
                name: c.name,
                status: age < 60000 ? 'ONLINE' : 'OFFLINE',
                lastSeen: c.lastSeen
            };
        });
    }
}
