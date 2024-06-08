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
import { JwtService } from '@nestjs/jwt';
import { Review, ReviewSchema } from 'src/lib/dbBase/schema/reviewSchema';
import { MemberInfoService } from 'src/service/members/member-info.service';
import { Member, MemberSchema } from 'src/lib/dbBase/schema/memberSchema';
import { Bookmark, BookmarkSchema } from 'src/lib/dbBase/schema/bookmarkSchema';
import { BookmarkController } from 'src/controller/camp/bookmark.controller';
import { BookmarkService } from 'src/service/camp/bookmark.service';
import { OptionalAuthGuard } from 'src/lib/interceptor/optional-auth.interceptor';
import { AuthService } from 'src/service/members/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CampList.name, schema: CampListSchema },
      { name: CampKeyword.name, schema: CampKeywordSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Member.name, schema: MemberSchema },
      { name: Bookmark.name, schema: BookmarkSchema },
    ]),
  ],
  controllers: [MainController, ReviewController, BookmarkController],
  providers: [
    MainService,
    ReviewService,
    JwtService,
    MemberInfoService,
    BookmarkService,
    AuthService,
    OptionalAuthGuard,
  ],
})
export class CampModule {}
