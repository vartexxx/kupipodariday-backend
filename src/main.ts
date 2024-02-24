import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { nestCsrf } from 'ncsrf';
import * as cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
  const app: INestApplication = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_PROVIDER));
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const configService = app.get(ConfigService);
  const config = new DocumentBuilder()
    .setTitle('Бекенд сервиса КупиПодариДай')
    .setDescription('Api сервиса вишлистов')
    .setVersion('1.0')
    .build();
  const document: OpenAPIObject = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  app.use(helmet());
  app.use(cookieParser());
  app.use(nestCsrf());
  await app.listen(configService.get('app.port'));
}
bootstrap();
