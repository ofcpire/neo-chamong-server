import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

@Schema()
export class Article extends Document {
  @Prop({ required: true, default: uuid })
  id: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop()
  articleImg: string;

  @Prop({ required: true })
  memberId: string;

  @Prop({ required: true, default: 0 })
  commentCnt: number;

  @Prop({ required: true, default: 0 })
  viewCnt: number;

  @Prop({ required: true, default: 0 })
  likeCnt: number;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop({ required: true, default: true })
  public: boolean;
}

export const ArticleSchema = SchemaFactory.createForClass(Article);

@Schema()
export class ArticleComment extends Document {
  @Prop({ required: true, default: uuid })
  id: string;

  @Prop({ required: true })
  articleId: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  memberId: string;

  @Prop({ required: true, default: true })
  public: boolean;

  @Prop({ default: Date.now, required: true })
  createdAt: Date;

  @Prop({ default: Date.now, required: true })
  updateddAt: Date;
}

export const ArticleCommentSchema =
  SchemaFactory.createForClass(ArticleComment);

@Schema()
export class ArticleLike extends Document {
  @Prop({ required: true })
  memberId: string;
  @Prop({ required: true })
  articleId: string;
}

export const ArticleLikeSchema = SchemaFactory.createForClass(ArticleLike);
