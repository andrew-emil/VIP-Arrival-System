import { Module } from '@nestjs/common';
import { CameraService } from './camera.service';
import { CameraController } from './camera.controller';
import { DeviceModule } from 'src/device/device.module';
import { FeedModule } from 'src/feed/feed.module';

@Module({
  providers: [CameraService],
  controllers: [CameraController],
  exports: [CameraService],
  imports: [DeviceModule, FeedModule]
})
export class CameraModule {}
