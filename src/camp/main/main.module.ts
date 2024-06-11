import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MainController } from './main.controller';
import { MainService } from 'src/camp/main/main.service';
import {
  CampList,
  CampKeyword,
  CampListSchema,
  CampKeywordSchema,
} from 'src/camp/campSchema';
import { AuthModule } from 'src/auth/auth.module';
import { BookmarkModule } from '../bookmark/bookmark.module';
import { ReviewModule } from '../review/review.module';
import { CampService } from '../camp.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CampList.name, schema: CampListSchema },
      { name: CampKeyword.name, schema: CampKeywordSchema },
    ]),
    AuthModule,
    BookmarkModule,
    ReviewModule,
  ],
  controllers: [MainController],
  providers: [MainService, CampService],
  exports: [MainService],
})
export class MainModule {}
