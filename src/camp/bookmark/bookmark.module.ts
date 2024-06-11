import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewController } from 'src/camp/review/review.controller';
import { Bookmark, BookmarkSchema } from './bookmark.schema';
import { BookmarkController } from 'src/camp/bookmark/bookmark.controller';
import { BookmarkService } from 'src/camp/bookmark/bookmark.service';
import { AuthModule } from 'src/auth/auth.module';
import { WishlistService } from 'src/camp/bookmark/wishlist.service';
import { CampService } from '../camp.service';
import { CampList, CampListSchema } from '../campSchema';
import { ReviewService } from '../review/review.service';
import { Review, ReviewSchema } from '../review/review.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bookmark.name, schema: BookmarkSchema },
      { name: CampList.name, schema: CampListSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    AuthModule,
  ],
  controllers: [ReviewController, BookmarkController],
  providers: [BookmarkService, WishlistService, CampService, ReviewService],
  exports: [BookmarkService, WishlistService],
})
export class BookmarkModule {}
