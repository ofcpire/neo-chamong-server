import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

@Schema()
export class Review extends Document {
  @Prop({ required: true, default: uuid })
  reviewId: string;
  @Prop({ required: true })
  memberId: string;
  @Prop({ required: true })
  contentId: number;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  rating: number;
  @Prop({ type: Date, default: Date.now })
  createdAt: Date;
  @Prop({ type: Date, default: Date.now })
  updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
