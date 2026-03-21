import { Injectable, UnauthorizedException } from '@nestjs/common';
import { randomBytes, randomUUID } from 'crypto';
import { HashingService } from 'src/core/hashing/hashing.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateDeviceDto } from './dto/create-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';

@Injectable()
export class DeviceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly hashingService: HashingService,
  ) { }

  async createDevice(dto: CreateDeviceDto) {
    const deviceId = randomUUID();
    const { plaintext, hash } = await this.generateTemporaryPassword();
    const device = await this.prisma.deviceAccount.create({
      data: {
        name: dto.name,
        cameraId: dto.cameraId,
        deviceId,
        isActive: true,
        temporaryPassword: hash,
      },
    });

    return { ...device, temporaryPassword: plaintext };
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

    if (!device) throw new UnauthorizedException('Unknown device');

    return device;
  }

  async findDeviceFromCamera(cameraId: string) {
    return this.prisma.deviceAccount.findMany({
      where: {
        cameraId
      }
    })
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
    const { plaintext, hash } = await this.generateTemporaryPassword();

    const device = await this.prisma.deviceAccount.update({
      where: { id },
      data: { temporaryPassword: hash },
    });

    return { ...device, temporaryPassword: plaintext };
  }

  async deleteDevice(id: string) {
    await this.findOneDevice(id);
    return this.prisma.deviceAccount.delete({
      where: { id },
    });
  }

  private async generateTemporaryPassword() {
    const plaintext = randomBytes(12).toString('base64url');
    const hash = await this.hashingService.hashPassword(plaintext);
    return { plaintext, hash };
  }
}
