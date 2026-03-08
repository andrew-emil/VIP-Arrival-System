import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { HashingModule } from './hashing/hashing.module';
import { RedisModule } from './redis/redis.module';

@Module({
    imports: [PrismaModule, HashingModule, RedisModule],
})
export class CoreModule { }
