import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { subMinutes } from 'date-fns';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { normalizePlate } from 'src/core/utils/plate-normalizer';
import { CreateVipDto } from './dto/createVip.dto';
import { UpdateVipDto } from './dto/updateVip.dto';
import { VipService } from './vip.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('VIP')
@Controller('vip')
@UseGuards(RolesGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class VipController {
    constructor(
        private readonly vipService: VipService,
        private readonly prisma: PrismaService,
    ) { }

    @Post()
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

    @Patch(':id')
    @ApiOperation({ summary: 'Update a VIP record' })
    @ApiParam({ name: 'id', description: 'VIP UUID' })
    @ApiBody({ type: UpdateVipDto })
    @ApiResponse({ status: 200, description: 'The VIP has been successfully updated.' })
    async update(@Param('id') id: string, @Body() updateVipDto: UpdateVipDto) {
        const vip = await this.vipService.update(id, updateVipDto);
        const plateNormalized = normalizePlate(updateVipDto.plate);
        const since = subMinutes(new Date(), 60);

        const events = await this.prisma.plateEvent.findMany({
            where: {
                plate: plateNormalized,
                timestamp: { gte: since },
            },
            include: { camera: true },
        });

        // run state machine on past events for the updated plate
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

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a VIP record' })
    @ApiParam({ name: 'id', description: 'VIP UUID' })
    @ApiResponse({ status: 204, description: 'VIP deleted successfully.' })
    async remove(@Param('id') id: string) {
        await this.vipService.remove(id);
    }

    @Get()
    @Roles(Role.OBSERVER)
    @ApiOperation({ summary: 'List all VIPs' })
    @ApiQuery({ name: 'plate', required: false, description: 'Filter by plate number' })
    @ApiResponse({ status: 200, description: 'List of VIPs.' })
    findAll(@Query('plate') plate?: string) {
        return this.vipService.listVips(plate);
    }
}


