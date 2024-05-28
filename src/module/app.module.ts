import { Module } from '@nestjs/common';
import { AppService } from '../service/app.service';
import { ConfigModule } from '@nestjs/config';
import { CampingModule } from './camping.module';
import { MembersModule } from './members.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local'],
      isGlobal: true,
    }),
    MembersModule,
    CampingModule,
  ],
  providers: [AppService],
})
export class AppModule {}
