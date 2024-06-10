import { Module } from '@nestjs/common';
import { AppService } from '../service/app.service';
import { ConfigModule } from '@nestjs/config';
import { CampModule } from './camp.module';
import { MembersModule } from './members/members.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesModule } from './articles.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local'],
      isGlobal: true,
    }),
    MembersModule,
    CampModule,
    ArticlesModule,
    MongooseModule.forRoot(process.env.MONGODB_URL),
  ],
  providers: [AppService],
})
export class AppModule {}
