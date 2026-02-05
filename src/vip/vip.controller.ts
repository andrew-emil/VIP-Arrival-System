import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { VipService } from './vip.service';
import { CreateVipDto } from './dto/createVip.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiSecurity } from '@nestjs/swagger';

@ApiTags('VIP')
@ApiSecurity('api-key')
@Controller('vip')
export class VipController {
    constructor(private readonly vipService: VipService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new VIP record' })
    @ApiResponse({ status: 201, description: 'The VIP has been successfully created.' })
    create(@Body() createVipDto: CreateVipDto) {
        return this.vipService.create(createVipDto);
    }

    @Get()
    @ApiOperation({ summary: 'List all VIPs' })
    @ApiQuery({ name: 'plate', required: false, description: 'Filter by plate number' })
    @ApiResponse({ status: 200, description: 'List of VIPs.' })
    findAll(@Query('plate') plate?: string) {
        return this.vipService.listVips(plate);
    }
}
