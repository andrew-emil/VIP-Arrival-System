import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from './auth/api-key.guard';
import { CameraModule } from './camera/camera.module';
import { CoreModule } from './core/core.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { RequestIdMiddleware } from './core/middlewares/request-id.middleware';
import { PrismaModule } from './core/prisma/prisma.module';
import { FeedModule } from './feed/feed.module';
import { HealthModule } from './health/health.module';
import { IngressModule } from './ingress/ingress.module';
import { PlateReadModule } from './plate-read/plate-read.module';
import { VipModule } from './vip/vip.module';
import { LoggerModule } from 'nestjs-pino';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
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
    LoggerModule.forRoot({
      pinoHttp: {
        transport: process.env.NODE_ENV !== 'production'
          ? { target: 'pino-pretty', options: { colorize: true } }
          : undefined,
      },
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: seconds(60),
          limit: 100
        }
      ]
    })
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RequestIdMiddleware)
      .forRoutes("*");
  }
}
