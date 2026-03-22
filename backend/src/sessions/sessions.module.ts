import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsController } from './sessions.controller';
import { RealtimeModule } from 'src/realtime/realtime.module';
import { CameraModule } from 'src/camera/camera.module';

@Module({
  controllers: [SessionsController],
  providers: [SessionsService],
  imports: [RealtimeModule, CameraModule]
})
export class SessionsModule { }
