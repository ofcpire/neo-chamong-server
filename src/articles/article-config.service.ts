import { Injectable } from '@nestjs/common';
import { SchemaUtilHelper } from 'src/common/helper/schema-util.helper';
import { Article, ArticleSchema, ArticleCommentSchema } from './article.schema';

@Injectable()
export class ArticleConfigService {
  constructor(private readonly schemaUtilHelper: SchemaUtilHelper) {}
  public schemaConfiguration() {
    const schemaUtilHelper = this.schemaUtilHelper;
    ArticleSchema.virtual('articleImg').get(function (this: Article) {
      if (this.imgName) return schemaUtilHelper.getFullImgAddress(this.imgName);
      else return null;
    });

    ArticleSchema.pre(['find', 'findOne'], function (next) {
      this.where({ public: true });
      next();
    });

    ArticleCommentSchema.pre(['find', 'findOne'], function (next) {
      this.where({ public: true });
      next();
    });
  }
}
