import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CameraModule } from './camera/camera.module';
import { CoreModule } from './core/core.module';
import { FeedModule } from './feed/feed.module';
import { HealthModule } from './health/health.module';
import { IngressModule } from './ingress/ingress.module';
import { PlateReadModule } from './plate-read/plate-read.module';
import { PrismaModule } from './core/prisma/prisma.module';
import { VipModule } from './vip/vip.module';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './auth/api-key.guard';
import { RequestIdMiddleware } from './core/middlewares/request-id.middleware';
import { IngressController } from './ingress/ingress.controller';
import { FeedController } from './feed/feed.controller';
import { VipController } from './vip/vip.controller';
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
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware)
      .forRoutes(IngressController, FeedController, VipController);
  }
}
