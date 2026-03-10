import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { HashingModule } from './hashing/hashing.module';
import { NonceModule } from './nonce/nonce.module';

@Module({
    imports: [PrismaModule, HashingModule, NonceModule],
})
export class CoreModule { }
