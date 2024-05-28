import { Module } from '@nestjs/common';
import { AppService } from '../service/app.service';
import { ConfigModule } from '@nestjs/config';
import { CampingModule } from './camping.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local'],
      isGlobal: true,
    }),
    AuthModule,
    CampingModule,
  ],
  providers: [AppService],
})
export class AppModule {}
