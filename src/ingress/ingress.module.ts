import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WebhookSecurityMiddleware } from 'src/core/middlewares/webhook-security.middleware';
import { IdempotencyModule } from 'src/idempotency/idempotency.module';
import { VipModule } from 'src/vip/vip.module';
import { IngressService } from './ingress.service';
import { QueueModule } from '../queue/queue.module';
import { RealtimeModule } from '../realtime/realtime.module';
import { forwardRef } from '@nestjs/common';
import { IngressController } from './ingress.controller';
import { NonceModule } from 'src/core/nonce/nonce.module';
import { CameraModule } from 'src/camera/camera.module';

@Module({
  imports: [
    IdempotencyModule,
    VipModule,
    forwardRef(() => QueueModule),
    RealtimeModule,
    NonceModule,
    CameraModule
  ],
  controllers: [IngressController],
  providers: [IngressService],
  exports: [IngressService],
})
export class IngressModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WebhookSecurityMiddleware)
      .forRoutes('ingress/webhook');
  }
}