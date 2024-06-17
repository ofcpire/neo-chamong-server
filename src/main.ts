import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

const corsOption: CorsOptions = {
  exposedHeaders: ['Authorization', 'Refresh'],
};

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(corsOption);
  await app.listen(15941);
}
bootstrap();
