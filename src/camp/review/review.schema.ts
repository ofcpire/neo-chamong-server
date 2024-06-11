import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

@Schema({ timestamps: true })
export class Review extends Document {
  @Prop({ required: true, default: uuid, unique: true })
  reviewId: string;

  @Prop({ required: true })
  memberId: string;

  @Prop({ required: true })
  contentId: number;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  rating: number;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
