import { Module } from '@nestjs/common';
import {
  Article,
  ArticleSchema,
  ArticleComment,
  ArticleCommentSchema,
  ArticleLike,
  ArticleLikeSchema,
} from 'src/lib/dbBase/schema/articleSchema';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesController } from 'src/controller/articles/articles.controller';
import { ArticlesService } from 'src/service/articles/articles.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Article.name, schema: ArticleSchema },
      { name: ArticleComment.name, schema: ArticleCommentSchema },
      { name: ArticleLike.name, schema: ArticleLikeSchema },
      { name: ArticleLike.name, schema: ArticleLikeSchema },
    ]),
    AuthModule,
  ],
  controllers: [ArticlesController],
  providers: [ArticlesService],
})
export class ArticlesModule {}
