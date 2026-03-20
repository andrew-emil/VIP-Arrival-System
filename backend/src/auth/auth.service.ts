import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { HashingService } from 'src/core/hashing/hashing.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly hashingService: HashingService,
    ) { }

    async login(dto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: dto.email },
        });

        if (!user || !user.passwordHash || !user.isActive) {
            throw new UnauthorizedException('Invalid Email or password');
        }

        const isMatch = await this.hashingService.comparePassword(dto.password, user.passwordHash);
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
            where: { deviceId },
            include: { camera: true },
        });

        if (!device) throw new UnauthorizedException('Unknown device');
        if (!device.isActive) throw new ForbiddenException('Device is deactivated');

        const passwordToCheck = device.temporaryPassword;
        if (!passwordToCheck) throw new UnauthorizedException('Invalid credentials');

        const isValid = await this.hashingService.comparePassword(password, passwordToCheck);
        if (!isValid) throw new UnauthorizedException('Invalid credentials');

        if (device.temporaryPassword) {
            await this.prisma.deviceAccount.update({
                where: { id: device.id },
                data: { temporaryPassword: null },
            });
        }

        return {
            deviceId: device.deviceId,
            name: device.name,
            cameraId: device.cameraId,
            cameraLabel: device.camera?.name ?? null,
        };
    }
}
