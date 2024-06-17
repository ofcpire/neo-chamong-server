import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
import { CampService } from './camp.service';
import { CampRepository } from './camp.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CampList.name, schema: CampListSchema },
      { name: CampKeyword.name, schema: CampKeywordSchema },
      { name: Bookmark.name, schema: BookmarkSchema },
    ]),
    AuthModule,
    ReviewModule,
    BookmarkModule,
  ],
  providers: [CampService, CampRepository],
  exports: [
    CampRepository,
    MongooseModule.forFeature([
      { name: CampList.name, schema: CampListSchema },
      { name: CampKeyword.name, schema: CampKeywordSchema },
    ]),
  ],
})
export class CampModule {}
