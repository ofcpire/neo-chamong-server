import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';
import * as _ from 'mongoose-lean-virtuals';
import { SchemaUtilHelper } from 'src/common/utils/utils/schema-util.helper';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Article extends Document {
  @Prop({ required: true, default: uuid })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  imgName: string;

  @Prop({ required: true })
  memberId: string;

  @Prop({ required: true, default: 0 })
  commentCnt: number;

  @Prop({ required: true, default: 0 })
  viewCnt: number;

  @Prop({ required: true, default: 0 })
  likeCnt: number;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  @Prop({ required: true, default: true })
  public: boolean;

  readonly articleImg: string;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

@Schema({ timestamps: true })
export class ArticleComment extends Document {
  @Prop({ required: true, default: uuid, unique: true })
  id: string;

  @Prop({ required: true })
  articleId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  memberId: string;

  @Prop({ required: true, default: true })
  public: boolean;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updateddAt: Date;
}

export const ArticleCommentSchema =
  SchemaFactory.createForClass(ArticleComment);

ArticleCommentSchema.pre(['find', 'findOne'], function (next) {
  this.where({ public: true });
  next();
});

@Schema({ timestamps: true })
export class ArticleLike extends Document {
  @Prop({ required: true })
  memberId: string;
  @Prop({ required: true })
  articleId: string;
  @Prop({ type: Date })
  createdAt: Date;
}

export const ArticleLikeSchema = SchemaFactory.createForClass(ArticleLike);
