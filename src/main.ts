import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { ConsoleLogger, LogLevel, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SeedService } from './database/seed.service';
import { Request, Response, NextFunction } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const logLevels: LogLevel[] = ['log', 'error', 'warn'];
  if (process.env.DEBUG === 'true') logLevels.push('debug');

  app.useLogger(
    new ConsoleLogger({
      prefix: 'TODOApp',
      timestamp: true,
      logLevels,
    }),
  );

  // Redirect root to /api before setting global prefix
  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.url === '/' || req.url === '') {
      return res.redirect(301, '/api');
    }
    next();
  });

  app
    .setGlobalPrefix('api')
    .use((cookieParser as unknown as () => import('express').RequestHandler)())
    .useGlobalPipes(new ValidationPipe({ transform: true }))
    .enableCors({ origin: '*' });

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Gamified Todo API')
    .setDescription("Documentation de l'API Gamified Todo")
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  // Seed database if AUTO_SEED is enabled
  const autoSeed = configService.get<string>('AUTO_SEED') === 'true';
  if (autoSeed) {
    const seedService = app.get(SeedService);
    await seedService.seedDatabase();
  }

  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port);
  console.log(`🚀 Application démarrée sur http://localhost:${port}`);
  console.log(`📚 Documentation Swagger: http://localhost:${port}/api`);
}
void bootstrap();
