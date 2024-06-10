import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MainController } from '../controller/camp/main.controller';
import { MainService } from 'src/service/camp/main.service';
import {
  CampList,
  CampKeyword,
  CampListSchema,
  CampKeywordSchema,
} from 'src/lib/dbBase/schema/campSchema';
import { ReviewService } from 'src/service/camp/review.service';
import { ReviewController } from 'src/controller/camp/review.controller';
import { Review, ReviewSchema } from 'src/lib/dbBase/schema/reviewSchema';
import { Bookmark, BookmarkSchema } from 'src/lib/dbBase/schema/bookmarkSchema';
import { BookmarkController } from 'src/controller/camp/bookmark.controller';
import { BookmarkService } from 'src/service/camp/bookmark.service';
import { AuthModule } from './auth.module';
import { WishlistService } from 'src/service/camp/wishlist.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CampList.name, schema: CampListSchema },
      { name: CampKeyword.name, schema: CampKeywordSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Bookmark.name, schema: BookmarkSchema },
    ]),
    AuthModule,
  ],
  controllers: [MainController, ReviewController, BookmarkController],
  providers: [MainService, ReviewService, BookmarkService, WishlistService],
})
export class CampModule {}
