import { Module } from '@nestjs/common';
import { MainController } from './controller/main/main.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local'],
      isGlobal: true,
    }),
  ],
  controllers: [MainController],
  providers: [AppService],
})
export class AppModule {}
