import { Module } from '@nestjs/common';
import { HashingModule } from 'src/core/hashing/hashing.module';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';

@Module({
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
  imports: [HashingModule]
})
export class DeviceModule {}
