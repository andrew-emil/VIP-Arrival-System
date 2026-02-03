import { Module } from '@nestjs/common';
import { CameraModule } from './camera/camera.module';
import { CoreModule } from './core/core.module';
import { FeedModule } from './feed/feed.module';
import { HealthModule } from './health/health.module';
import { IngressModule } from './ingress/ingress.module';
import { PlateReadModule } from './plate-read/plate-read.module';
import { PrismaModule } from './prisma/prisma.module';
import { VipModule } from './vip/vip.module';
@Module({
  imports: [
    PrismaModule,
    IngressModule,
    PlateReadModule,
    VipModule,
    CameraModule,
    FeedModule,
    CoreModule,
    HealthModule,
  ],
  providers: [],
})
export class AppModule { }
