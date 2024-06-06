import { Module } from '@nestjs/common';
import {
  Article,
  ArticleSchema,
  ArticleComment,
  ArticleCommentSchema,
  ArticleLike,
  ArticleLikeSchema,
} from 'src/lib/dbBase/schema/articleSchema';
import { Member, MemberSchema } from 'src/lib/dbBase/schema/memberSchema';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesController } from 'src/controller/articles/articles.controller';
import { ArticlesService } from 'src/service/articles/articles.service';
import { MemberInfoService } from 'src/service/members/member-info.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { OptionalAuthGuard } from 'src/lib/interceptor/optional-auth.interceptor';
import { AuthService } from 'src/service/members/auth.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: ArticleComment.name, schema: ArticleCommentSchema },
      { name: ArticleLike.name, schema: ArticleLikeSchema },
      { name: ArticleLike.name, schema: ArticleLikeSchema },
      { name: Member.name, schema: MemberSchema },
    ]),
  ],
  controllers: [ArticlesController],
  providers: [
    ArticlesService,
    MemberInfoService,
    JwtService,
    ConfigService,
    AuthService,
    OptionalAuthGuard,
  ],
})
export class ArticlesModule {}
