import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewController } from 'src/camp/review/review.controller';
import { Bookmark, BookmarkSchema } from './bookmark.schema';
import { BookmarkController } from 'src/camp/bookmark/bookmark.controller';
import { BookmarkService } from 'src/camp/bookmark/bookmark.service';
import { AuthModule } from 'src/auth/auth.module';
import { BookmarkWishlistService } from 'src/camp/bookmark/bookmark-wishlist.service';
import { CampService } from '../camp.service';
import {
  CampKeyword,
  CampKeywordSchema,
  CampList,
  CampListSchema,
} from '../campSchema';
import { ReviewService } from '../review/review.service';
import { Review, ReviewSchema } from '../review/review.schema';
import { ReviewModule } from '../review/review.module';
import { MembersModule } from 'src/members/members.module';
import { MemberRepository } from 'src/members/member.repository';
import { CampRepository } from '../camp.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bookmark.name, schema: BookmarkSchema },
      { name: CampList.name, schema: CampListSchema },
      { name: CampKeyword.name, schema: CampKeywordSchema },
      { name: Review.name, schema: ReviewSchema },
    ]),
    AuthModule,
    ReviewModule,
    MembersModule,
  ],
  controllers: [ReviewController, BookmarkController],
  providers: [
    BookmarkService,
    BookmarkWishlistService,
    CampService,
    ReviewService,
    MemberRepository,
    CampRepository,
  ],
  exports: [
    BookmarkService,
    BookmarkWishlistService,
    MongooseModule.forFeature([
      { name: Bookmark.name, schema: BookmarkSchema },
    ]),
  ],
})
export class BookmarkModule {}
