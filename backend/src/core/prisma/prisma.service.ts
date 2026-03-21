import "dotenv/config"
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);
    
    constructor() {
        const pool = new PrismaPg({ connectionString: process.env.DATABASE_URL as string });
        super({ adapter: pool });
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log('Prisma connected');
    }

    async onModuleDestroy() {
        await this.$disconnect();
    }
}
