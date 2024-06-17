import { Module } from '@nestjs/common';
import { MypageController } from 'src/members/mypage/mypage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MypageService } from 'src/members/mypage/mypage.service';
import { ReviewService } from 'src/camp/review/review.service';
import { Review, ReviewSchema } from 'src/camp/review/review.schema';
import { CampList, CampListSchema } from 'src/camp/campSchema';
import { AuthModule } from '../../auth/auth.module';
import { PickPlacesService } from 'src/place/pick-places/pick-places.service';
import { ArticlesService } from 'src/articles/articles.service';
import { BookmarkService } from 'src/camp/bookmark/bookmark.service';
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
import { Member, MemberSchema } from '../member.schema';
import { ArticlesModule } from 'src/articles/articles.module';
import { SchemaUtilHelper } from 'src/common/utils/utils/schema-util.helper';

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
  ],
  controllers: [MypageController],
  providers: [
    CampService,
    ReviewService,
    MypageService,
    PickPlacesService,
    ArticlesService,
    BookmarkService,
    SchemaUtilHelper,
  ],
})
export class MypageModule {}
