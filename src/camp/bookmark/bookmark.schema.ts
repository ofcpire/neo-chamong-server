import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

@Schema()
export class Bookmark extends Document {
  @Prop({ required: true })
  memberId: string;

  @Prop({ required: true })
  contentId: number;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ default: uuid, unique: true })
  bookmarkId: string;
}

export const BookmarkSchema = SchemaFactory.createForClass(Bookmark);
