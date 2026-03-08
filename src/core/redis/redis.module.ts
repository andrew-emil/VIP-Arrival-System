import KeyvRedis, { Keyv } from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { CacheableMemory } from 'cacheable';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [RedisService],
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigService],
      useFactory: async () => {
        return {
          stores: [
            new Keyv({
              store: new CacheableMemory({ ttl: 60000, lruSize: 5000 }),
            }),
            new KeyvRedis('redis://localhost:6379'),
          ],
        };
      },
      inject: [ConfigService]
    })
  ]
})
export class RedisModule {}
