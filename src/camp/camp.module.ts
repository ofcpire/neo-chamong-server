import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MainService } from 'src/camp/main/main.service';
import {
  CampList,
  CampKeyword,
  CampListSchema,
  CampKeywordSchema,
} from 'src/camp/campSchema';
import { Bookmark, BookmarkSchema } from './bookmark/bookmark.schema';
import { AuthModule } from '../auth/auth.module';
import { ReviewModule } from './review/review.module';
import { BookmarkModule } from './bookmark/bookmark.module';
import { MainModule } from './main/main.module';
import { CampService } from './camp.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CampList.name, schema: CampListSchema },
      { name: CampKeyword.name, schema: CampKeywordSchema },
      { name: Bookmark.name, schema: BookmarkSchema },
    ]),
    MainModule,
    AuthModule,
    ReviewModule,
    BookmarkModule,
  ],
  providers: [MainService, CampService],
})
export class CampModule {}
