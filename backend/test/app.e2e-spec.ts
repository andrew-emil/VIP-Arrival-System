import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/core/prisma/prisma.service';

describe('AppController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PrismaService)
            .useValue({
                $connect: jest.fn(),
                $disconnect: jest.fn(),
                $queryRaw: jest.fn().mockResolvedValue([{ 1: 1 }]),
            })
            .compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    // or that any unknown route gives a standard 404/Not Found.
    it('handles unknown routes with 404', () => {
        return request(app.getHttpServer())
            .get('/nonexistent-route-for-testing')
            .expect(404);
    });

    // Verify that the health endpoint is working normally
    it('GET /health should return 200', () => {
        return request(app.getHttpServer())
            .get('/health')
            .expect(200);
    });
});
