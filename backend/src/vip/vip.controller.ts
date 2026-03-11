import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { subMinutes } from 'date-fns';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { normalizePlate } from 'src/core/utils/plate-normalizer';
import { CreateVipDto } from './dto/createVip.dto';
import { VipService } from './vip.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('VIP')
@Controller('vip')
@UseGuards(RolesGuard)
export class VipController {
    constructor(
        private readonly vipService: VipService,
        private readonly prisma: PrismaService,
    ) { }

    @Post()
    @Roles(Role.MANAGER, Role.OPERATOR)
    @ApiOperation({ summary: 'Create a new VIP record' })
    @ApiResponse({ status: 201, description: 'The VIP has been successfully created.' })
    async create(@Body() createVipDto: CreateVipDto) {
        const vip = await this.vipService.create(createVipDto);
        const plateNormalized = normalizePlate(createVipDto.plate)
        const since = subMinutes(new Date(), 60);

        const events = await this.prisma.plateEvent.findMany({
            where: {
                plate: plateNormalized,
                timestamp: { gte: since },
            },
            include: { camera: true },
        });

        // 3️⃣ run state machine on past events
        for (const ev of events) {
            await this.vipService.handlePlateEvent(ev, ev.camera);
        }

        return {
            id: vip.id,
            name: vip.name,
            plate: plateNormalized,
            retroMatchedEvents: events.length,
        };
    }

    @Get()
    @Roles(Role.MANAGER, Role.OPERATOR, Role.OBSERVER)
    @ApiOperation({ summary: 'List all VIPs' })
    @ApiQuery({ name: 'plate', required: false, description: 'Filter by plate number' })
    @ApiResponse({ status: 200, description: 'List of VIPs.' })
    findAll(@Query('plate') plate?: string) {
        return this.vipService.listVips(plate);
    }
}


