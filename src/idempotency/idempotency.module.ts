import { Module } from '@nestjs/common';
import { IdempotencyService } from './idempotency.service';
import { CacheModule } from '@nestjs/cache-manager';
import { seconds } from '@nestjs/throttler';
import { CacheableMemory } from 'cacheable';

@Module({
  providers: [IdempotencyService],
  exports: [IdempotencyService],
  imports: [
    CacheModule.register({
      store: new CacheableMemory({
        ttl: seconds(10),
        lruSize: 5000,
      }),
    }),
  ]
})
export class IdempotencyModule {}
