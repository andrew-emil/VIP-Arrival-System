import { Module } from '@nestjs/common';
import { HashingModule } from 'src/core/hashing/hashing.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [HashingModule]
})
export class UsersModule {}
