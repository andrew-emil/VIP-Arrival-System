import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { NonceService } from './nonce.service';
import { CacheableMemory } from 'cacheable';
import { seconds } from '@nestjs/throttler';

@Module({
  providers: [NonceService],
  imports: [
    CacheModule.register({
      store: new CacheableMemory({
        ttl: seconds(60),
        lruSize: 5000,
      }),
    }),
  ],
  exports: [NonceService],
})
export class NonceModule { }