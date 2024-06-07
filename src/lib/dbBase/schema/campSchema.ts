import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'camps' })
export class CampList extends Document {
  @Prop({ default: 0 })
  totalRating: number;

  @Prop({ required: true })
  contentId: number;

  @Prop()
  facltNm: string;

  @Prop()
  lineIntro: string;

  @Prop()
  intro: string;

  @Prop()
  themaEnvrnCl: string;

  @Prop()
  mapX: number;

  @Prop()
  mapY: number;

  @Prop()
  addr1: string;

  @Prop()
  tel: string;

  @Prop()
  homepage: string;

  @Prop()
  resveCl: string;

  @Prop()
  doNm: string;

  @Prop()
  manageSttus: string;

  @Prop()
  induty: string;

  @Prop()
  firstImageUrl: string;

  @Prop()
  createdtime: string;

  @Prop()
  modifiedtime: string;

  @Prop()
  featureNm: string;

  @Prop()
  brazierCl: string;

  @Prop()
  glampInnerFclty: string;

  @Prop()
  caravInnerFclty: string;

  @Prop()
  sbrsCl: string;

  @Prop()
  animalCmgCl: string;

  @Prop()
  exprnProgrmAt: string;

  @Prop()
  exprnProgrm: string;

  @Prop()
  posblFcltyCl: string;

  @Prop()
  lctCl: string;
}

export const CampListSchema = SchemaFactory.createForClass(CampList);

@Schema()
export class CampReview extends Document {
  @Prop()
  author: string;

  @Prop({ type: Date, default: Date.now })
  createdAt: Date;

  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;

  @Prop()
  reviewId: number;

  @Prop()
  content: string;

  @Prop()
  rating: number;
}

export const CampReviewSchema = SchemaFactory.createForClass(CampReview);

@Schema({ collection: 'keywords' })
export class CampKeyword extends Document {
  @Prop()
  keywordId: number;

  @Prop([String])
  keyword: string[];
}

export const CampKeywordSchema = SchemaFactory.createForClass(CampKeyword);
