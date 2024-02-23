import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule, ConfigService } from '@nestjs/config';
import config from '../config';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { WishesModule } from './wishes/wishes.module';
import { WishlistsModule } from './wishlists/wishlists.module';
import { OffersModule } from './offers/offers.module';
import { AuthModule } from './auth/auth.module';
import { HashModule } from './hash/hash.module';

const schema: Joi.ObjectSchema = Joi.object({
  database: Joi.object({
    host: Joi.string(),
    port: Joi.number().integer(),
    name: Joi.string(),
    username: Joi.string(),
    password: Joi.string(),
    synchronize: Joi.boolean(),
  }),
  app: Joi.object({
    port: Joi.number().integer(),
  }),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
      validationSchema: schema,
    }),
    WinstonModule.forRoot({
      levels: {
        critical_error: 0,
        error: 1,
        special_warning: 2,
        another_log_level: 3,
        info: 4,
      },
      transports: [
        new winston.transports.Console({ format: winston.format.simple() }),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
      ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('database.host'),
        port: config.get('database.port'),
        database: config.get('database.name'),
        username: config.get('database.username'),
        password: config.get('database.password'),
        synchronize: config.get('database.synchronize'),
        entities: [__dirname + '/**/*.entity{.js, .ts}'],
      }),
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
    HashModule,
  ],
})
export class AppModule {}
