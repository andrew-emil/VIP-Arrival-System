import { Module } from '@nestjs/common';
import { VipController } from './vip.controller';
import { VipService } from './vip.service';

@Module({
    controllers: [VipController],
    providers: [VipService]
})
export class VipModule { }
