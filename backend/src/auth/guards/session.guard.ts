import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
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
        const userId = request.session?.['userId'];

        if (!userId) {
            throw new UnauthorizedException('Authentication required');
        }

        // Load user from DB so that RolesGuard can read req.user.role
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, name: true, email: true, role: true, isActive: true },
        });

        if (!user || !user.isActive) {
            throw new UnauthorizedException('Session invalid or account disabled');
        }

        // Populate req.user — the same shape RolesGuard expects
        (request as any).user = user;
        return true;
    }
}
