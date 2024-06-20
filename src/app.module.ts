import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CampModule } from './camp/camp.module';
import { MembersModule } from './members/members.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesModule } from './articles/articles.module';
import { PlaceModule } from './place/place.module';
import { MypageModule } from './mypage/mypage.module';
import { MainModule } from './main/main.module';
import { ImageModule } from './image/image.module';
import { HelperModule } from './common/helper/helper.module';

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
    MypageModule,
    MainModule,
    ImageModule,
    HelperModule,
    MongooseModule.forRoot(process.env.MONGODB_URL),
  ],
})
export class AppModule {}
