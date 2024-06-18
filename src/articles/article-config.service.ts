import { Injectable } from '@nestjs/common';
import { SchemaUtilHelper } from 'src/common/utils/utils/schema-util.helper';
import { Article, ArticleSchema, ArticleCommentSchema } from './article.schema';
import * as _ from 'mongoose-lean-virtuals';
const schemaUtilHelper = new SchemaUtilHelper();

@Injectable()
export class ArticleConfigService {
  public schemaConfiguration() {
    ArticleSchema.plugin(_.mongooseLeanVirtuals);

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
