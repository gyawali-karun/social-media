import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 4000;
  const globalPrefix = 'api';

  app.setGlobalPrefix(globalPrefix);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(helmet());
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Social Media Backend')
    .setDescription('API documentation for the Social Media NestJS backend')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'jwt' },
      'jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  logger.log(
    `🚀 Application running on http://localhost:${port}/${globalPrefix}`,
  );
  logger.log(
    `📖 Swagger docs available at http://localhost:${port}/${globalPrefix}/docs`,
  );
}
void bootstrap();
