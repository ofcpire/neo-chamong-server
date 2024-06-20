import { Module } from '@nestjs/common';
import {
  Article,
  ArticleSchema,
  ArticleComment,
  ArticleCommentSchema,
  ArticleLike,
  ArticleLikeSchema,
} from 'src/articles/article.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesController } from 'src/articles/articles.controller';
import { ArticlesService } from 'src/articles/articles.service';
import { AuthModule } from '../auth/auth.module';
import { ArticleConfigService } from './article-config.service';
import { MembersModule } from 'src/members/members.module';
import { ArticlesRepository } from './articles.repository';
import { HelperModule } from 'src/common/helper/helper.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: ArticleComment.name, schema: ArticleCommentSchema },
      { name: ArticleLike.name, schema: ArticleLikeSchema },
    ]),
    AuthModule,
    MembersModule,
    HelperModule,
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService, ArticlesRepository, ArticleConfigService],
  exports: [
    ArticlesService,
    ArticleConfigService,
    ArticlesRepository,
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: ArticleComment.name, schema: ArticleCommentSchema },
      { name: ArticleLike.name, schema: ArticleLikeSchema },
    ]),
  ],
})
export class ArticlesModule {}
