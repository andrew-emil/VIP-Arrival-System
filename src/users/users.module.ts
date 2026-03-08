import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/core/prisma/prisma.module';
import { HashingModule } from 'src/core/hashing/hashing.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [PrismaModule, HashingModule]
})
export class UsersModule {}
