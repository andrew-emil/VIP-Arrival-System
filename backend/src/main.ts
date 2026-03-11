import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import express from 'express';
import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(Logger));

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    credentials: true,
  });
  app.use(helmet());
  app.use(compression());
  app.use(express.json({ limit: '1mb' }));

  // ──────────────────────── Swagger ───────────────────────────────────────
  const config = new DocumentBuilder()
    .setTitle('VAS API')
    .setDescription('VIP Arrival System – Session Auth')
    .setVersion('1.0')
    .addCookieAuth('sid', { type: 'apiKey', in: 'cookie', name: 'sid' }, 'cookie-auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  import('pino').then(({ default: pino }) => {
    pino().error(err);
    process.exit(1);
  });
});