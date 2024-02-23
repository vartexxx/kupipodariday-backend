import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(WINSTON_MODULE_PROVIDER));
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  const configService = app.get(ConfigService);
  //
  const config = new DocumentBuilder()
    .setTitle('Бекенд сервиса КупиПодариДай')
    .setDescription('Назначение API сервиса (описание)')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);
  //
  await app.listen(configService.get('app.port'));
}
bootstrap();
