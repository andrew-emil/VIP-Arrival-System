import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../core/prisma/prisma.service';
import { Public } from '../auth/public.decorator';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Health')
@Public()
@Controller('health')
export class HealthController {
    constructor(private readonly prisma: PrismaService) { }

    @Get()
    @ApiOperation({ summary: 'Health check' })
    @ApiResponse({ status: 200, description: 'Service status' })
    async check() {
        await this.prisma.$queryRaw`SELECT 1`;

        return {
            status: 'ok',
            database: 'connected',
            service: "VAS Backend",
            timestamp: new Date().toISOString(),
        };
    }
}
