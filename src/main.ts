import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import { LoggingInterceptor } from './common/interceptor/logging-interceptor';

async function bootstrap() {
  dotenv.config();
  const origin = process.env.ORIGIN || '*';
  const port = process.env.PORT || 15941;
  const corsOption: CorsOptions = {
    exposedHeaders: ['Authorization', 'Refresh'],
    origin: origin,
  };
  const app = await NestFactory.create(AppModule);
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors(corsOption);
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(port);
}
bootstrap();
