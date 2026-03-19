import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateCameraDto } from './dto/create-camera.dto';
import { UpdateCameraDto } from './dto/update-camera.dto';

@Injectable()
export class CameraService {
    constructor(private readonly prisma: PrismaService) { }

    async createCamera(dto: CreateCameraDto) {
        return this.prisma.camera.create({
            data: {
                name: dto.name,
                ip: dto.ip,
                location: dto.location,
                role: dto.role,
                eventId: dto.eventId,
            },
            include: { event: true },
        });
    }

    async findAllCameras() {
        return this.prisma.camera.findMany({
            include: { event: true },
            orderBy: { name: 'asc' },
        });
    }

    async findOneCamera(id: string) {
        const camera = await this.prisma.camera.findUnique({
            where: { id },
            include: { event: true },
        });

        if (!camera) throw new NotFoundException('Camera not found');
        return camera;
    }

    async updateCamera(id: string, dto: UpdateCameraDto) {
        await this.findOneCamera(id);
        return this.prisma.camera.update({
            where: { id },
            data: dto,
            include: { event: true },
        });
    }

    async deleteCamera(id: string) {
        await this.findOneCamera(id);
        return this.prisma.camera.delete({
            where: { id },
        });
    }

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
