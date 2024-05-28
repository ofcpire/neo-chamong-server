import { NestFactory } from '@nestjs/core';
import { AppModule } from './module/app.module';
import connectDB from './lib/dbBase/connectDB';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const corsOption: CorsOptions = {
  exposedHeaders: ['Authorization', 'Refresh'],
};

async function bootstrap() {
  await connectDB();
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOption);
  await app.listen(15941);
}
bootstrap();
