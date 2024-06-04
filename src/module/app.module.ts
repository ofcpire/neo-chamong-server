import { Module } from '@nestjs/common';
import { AppService } from '../service/app.service';
import { ConfigModule } from '@nestjs/config';
import { CampModule } from './camp.module';
import { MembersModule } from './members.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local'],
      isGlobal: true,
    }),
    MembersModule,
    CampModule,
    MongooseModule.forRoot(process.env.MONGODB_URL),
  ],
  providers: [AppService],
})
export class AppModule {}
