import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CampModule } from './camp/camp.module';
import { MembersModule } from './members/members.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesModule } from './articles/articles.module';
import { PlaceModule } from './place/place.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env', '.env.local'],
      isGlobal: true,
    }),
    MembersModule,
    CampModule,
    ArticlesModule,
    PlaceModule,
    MongooseModule.forRoot(process.env.MONGODB_URL),
  ],
})
export class AppModule {}
