import { Module } from '@nestjs/common';
import { VipController } from './vip.controller';
import { VipService } from './vip.service';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
    imports: [RealtimeModule],
    controllers: [VipController],
    providers: [VipService],
    exports: [VipService]
})
export class VipModule { }
