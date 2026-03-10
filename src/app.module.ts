import { BullModule } from '@nestjs/bullmq';
import { MiddlewareConsumer, Module, NestModule, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import Joi from 'joi';
import { LoggerModule } from 'nestjs-pino';
import { AuthModule } from './auth/auth.module';
import { SessionGuard } from './auth/guards/session.guard';
import { SessionMiddleware } from './auth/middlewares/session.middleware';
import { CameraModule } from './camera/camera.module';
import { apiKeySchema } from './config/key.config';
import redisConfig, { redisSchema } from './config/redis.config';
import { CoreModule } from './core/core.module';
import { HttpExceptionFilter } from './core/filters/http-exception.filter';
import { RequestIdMiddleware } from './core/middlewares/request-id.middleware';
import { EventsModule } from './events/events.module';
import { FeedModule } from './feed/feed.module';
import { HealthModule } from './health/health.module';
import { IdempotencyModule } from './idempotency/idempotency.module';
import { IngressModule } from './ingress/ingress.module';
import { QueueModule } from './queue/queue.module';
import { RealtimeModule } from './realtime/realtime.module';
import { UsersModule } from './users/users.module';
import { VipModule } from './vip/vip.module';

@Module({
  imports: [
    AuthModule,
    IngressModule,
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
          limit: 100,
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi
        .object()
        .concat(apiKeySchema)
        .concat(redisSchema),
      envFilePath: ['.env'],
      load: [redisConfig],
    }),
    BullModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow<string>('redis.host'),
          port: configService.getOrThrow<number>('redis.port'),
        },
      }),
    }),
    UsersModule,
    EventsModule,
    IdempotencyModule,
    QueueModule,
    RealtimeModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: SessionGuard,
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      })
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      // 1. Sessions must be established before any route logic
      .apply(SessionMiddleware, RequestIdMiddleware)
      .forRoutes('*');
  }
}

