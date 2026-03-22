import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HashingService } from 'src/core/hashing/hashing.service';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { DeviceService } from 'src/device/device.service';
import { UsersService } from 'src/users/users.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly hashingService: HashingService,
        private readonly usersService: UsersService,
        private readonly deviceService: DeviceService,
    ) { }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);

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
        return this.usersService.findOne(userId);
    }

    async deviceLogin(deviceId: string, password: string) {
        const device = await this.deviceService.findDeviceForAuth(deviceId);
        if (!device.isActive) throw new UnauthorizedException('Invalid credentials');

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
            deviceAccountId: device.id,
            deviceId: device.deviceId,
            name: device.name,
            cameraId: device.cameraId,
            cameraLabel: device.camera?.name ?? null,
        };
    }
}
