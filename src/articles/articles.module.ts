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
import { FormdataService } from 'src/common/utils/services/formdata.service';

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
  providers: [ArticlesService, FormdataService],
})
export class ArticlesModule {}
