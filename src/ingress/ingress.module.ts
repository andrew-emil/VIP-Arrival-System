import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { IngressController } from './ingress.controller';
import { IngressService } from './ingress.service';
import { verifyHmac } from 'src/core/middlewares/verifyHmac.middleware';

@Module({
  controllers: [IngressController],
  providers: [IngressService]
})
export class IngressModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(verifyHmac).forRoutes('/ingress')
  }
}
