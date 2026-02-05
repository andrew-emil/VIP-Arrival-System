import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { VipService } from './vip.service';
import { CreateVipDto } from './dto/createVip.dto';

@Controller('vip')
export class VipController {
    constructor(private readonly vipService: VipService) { }

    @Post()
    create(@Body() createVipDto: CreateVipDto) {
        return this.vipService.create(createVipDto);
    }

    @Get()
    findAll(@Query('plate') plate?: string) {
        return this.vipService.listVips(plate);
    }
}
