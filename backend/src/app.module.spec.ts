import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { PrismaService } from './core/prisma/prisma.service';

describe('AppModule Smoke Test', () => {
    let moduleRef: TestingModule;
    let prisma: PrismaService;

    beforeAll(async () => {
        moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        prisma = moduleRef.get<PrismaService>(PrismaService);
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it('should compile the module successfully', () => {
        expect(moduleRef).toBeDefined();
    });

    it('should connect to the database successfully', async () => {
        // Query the DB to verify the connection is alive
        const result = await prisma.$queryRawUnsafe('SELECT 1');
        expect(result).toBeDefined();
    });
});
