import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { WebhookSecurityMiddleware } from 'src/core/middlewares/webhook-security.middleware';
import { IdempotencyModule } from 'src/idempotency/idempotency.module';
import { VipModule } from 'src/vip/vip.module';
import { IngressController } from './ingress.controller';
import { IngressService } from './ingress.service';

@Module({
  imports: [
    IdempotencyModule,
    VipModule
  ],
  controllers: [IngressController],
  providers: [IngressService]
})
export class IngressModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WebhookSecurityMiddleware)
      .forRoutes('ingress/webhook');
  }
}