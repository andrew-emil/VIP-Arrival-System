import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class SessionGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly prisma: PrismaService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // Allow routes decorated with @Public()
        const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (isPublic) return true;

        const request = context.switchToHttp().getRequest<Request>();
        const session = request.session;
        const userId = session?.['userId'] as string | undefined;
        const deviceAccountId = session?.['deviceAccountId'] as string | undefined;
        console.log(session)

        if (!userId && !deviceAccountId) {
            throw new UnauthorizedException('Authentication required');
        }

        if (userId) {
            const user = await this.prisma.user.findUnique({
                where: { id: userId },
                select: { id: true, name: true, email: true, role: true, isActive: true },
            });

            if (!user || !user.isActive) {
                throw new UnauthorizedException('Session invalid or account disabled');
            }

            (request as any).user = user;
            return true;
        }

        if (!deviceAccountId) {
            throw new UnauthorizedException('Authentication required');
        }

        const device = await this.prisma.deviceAccount.findUnique({
            where: { id: deviceAccountId },
            select: { id: true, name: true, isActive: true },
        });

        if (!device || !device.isActive) {
            throw new UnauthorizedException('Session invalid or device disabled');
        }

        (request as any).user = {
            id: device.id,
            name: device.name,
            email: '',
            role: Role.GATE_GUARD,
            isActive: true,
        };
        return true;
    }
}
