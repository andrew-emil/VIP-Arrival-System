import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { IngressModule } from './ingress/ingress.module';
import { PlateReadModule } from './plate-read/plate-read.module';
import { VipModule } from './vip/vip.module';
import { CameraModule } from './camera/camera.module';
import { FeedModule } from './feed/feed.module';
import { CoreModule } from './core/core.module';
import { HealthModule } from './health/health.module';
@Module({
  imports: [
    AuthModule,
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
