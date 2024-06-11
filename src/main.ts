import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const corsOption: CorsOptions = {
  exposedHeaders: ['Authorization', 'Refresh'],
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOption);
  await app.listen(15941);
}
bootstrap();
