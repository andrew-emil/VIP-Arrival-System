import { Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DeviceService {
  constructor(private prisma: PrismaService) { }

  async createDevice(dto: CreateDeviceDto) {
    const deviceId = randomUUID();
    const temporaryPassword = Math.random().toString(36).slice(-10);

    return this.prisma.deviceAccount.create({
      data: {
        name: dto.name,
        cameraId: dto.cameraId,
        deviceId,
        temporaryPassword,
      },
    });
  }

  async findAllDevices() {
    return this.prisma.deviceAccount.findMany({
      include: { camera: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async findOneDevice(id: string) {
    const device = await this.prisma.deviceAccount.findUnique({
      where: { id },
      include: { camera: true },
    });

    if (!device) throw new NotFoundException("Device not found");

    return device;
  }

  async updateDevice(id: string, dto: UpdateDeviceDto) {
    await this.findOneDevice(id);

    return this.prisma.deviceAccount.update({
      where: { id },
      data: dto,
    });
  }

  async deactivateDevice(id: string) {
    await this.findOneDevice(id);

    return this.prisma.deviceAccount.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async regenerateDevicePassword(id: string) {
    await this.findOneDevice(id);

    const newPassword = Math.random().toString(36).slice(-10);

    return this.prisma.deviceAccount.update({
      where: { id },
      data: { temporaryPassword: newPassword },
    });
  }
}
