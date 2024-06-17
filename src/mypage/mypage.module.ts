import { Module } from '@nestjs/common';
import { MypageController } from './mypage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MypageService } from './mypage.service';
import { ReviewService } from 'src/camp/review/review.service';
import { Review, ReviewSchema } from 'src/camp/review/review.schema';
import { CampList, CampListSchema } from 'src/camp/campSchema';
import { AuthModule } from 'src/auth/auth.module';
import { PickPlacesService } from 'src/place/pick-places/pick-places.service';
import { ArticlesService } from 'src/articles/articles.service';
import { BookmarkService } from 'src/camp/bookmark/bookmark.service';
import { Member, MemberSchema } from 'src/members/member.schema';
import { Bookmark, BookmarkSchema } from 'src/camp/bookmark/bookmark.schema';
import {
  Article,
  ArticleComment,
  ArticleCommentSchema,
  ArticleLike,
  ArticleLikeSchema,
  ArticleSchema,
} from 'src/articles/article.schema';
import {
  PickPlace,
  PickPlaceSchema,
} from 'src/place/pick-places/pick-places.schema';
import { CampService } from 'src/camp/camp.service';
import { ArticlesModule } from 'src/articles/articles.module';
import { MembersModule } from 'src/members/members.module';
import { MemberRepository } from 'src/members/member.repository';
import { ReviewModule } from 'src/camp/review/review.module';
import { CampModule } from 'src/camp/camp.module';
import { PickPlaceModule } from 'src/place/pick-places/pick-places.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Member.name, schema: MemberSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: CampList.name, schema: CampListSchema },
      { name: Bookmark.name, schema: BookmarkSchema },
      { name: Article.name, schema: ArticleSchema },
      { name: ArticleLike.name, schema: ArticleLikeSchema },
      { name: ArticleComment.name, schema: ArticleCommentSchema },
      { name: PickPlace.name, schema: PickPlaceSchema },
    ]),
    AuthModule,
    ArticlesModule,
    MembersModule,
    ReviewModule,
    CampModule,
    PickPlaceModule,
  ],
  controllers: [MypageController],
  providers: [
    CampService,
    ReviewService,
    MypageService,
    PickPlacesService,
    ArticlesService,
    BookmarkService,
    MemberRepository,
  ],
})
export class MypageModule {}
