import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import connectDB from './lib/dbBase/connectDB';

async function bootstrap() {
  await connectDB();
  const app = await NestFactory.create(AppModule);
  await app.listen(15941);
}
bootstrap();
