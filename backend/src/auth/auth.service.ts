import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService) { }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user || !user.passwordHash || !user.isActive) {
            throw new UnauthorizedException('Invalid Email or password');
        }

        const isMatch = await bcrypt.compare(dto.password, user.passwordHash);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid Email or password');
        }

        return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }

    async getProfile(userId: string) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, isActive: true, createdAt: true },
        });

        if (!user) throw new UnauthorizedException('Session invalid');
        return user;
    }

    async deviceLogin(deviceId: string, password: string) {
        const device = await this.prisma.deviceAccount.findUnique({
            where: { deviceId }
        });

        if (!device || !device.isActive || device.temporaryPassword !== password) {
            throw new UnauthorizedException("Invalid device ID or password");
        }

        return {
            deviceId: device.deviceId,
            cameraId: device.cameraId
        };
    }
}
