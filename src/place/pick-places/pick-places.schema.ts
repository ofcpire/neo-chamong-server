import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';

@Schema({ timestamps: true })
export class PickPlace extends Document {
  @Prop({ required: true, default: uuid, unique: true })
  id: string;

  @Prop({ required: true })
  memberId: string;

  @Prop()
  memo: string;

  @Prop({ default: null })
  imgName: string;

  @Prop({ default: [] })
  keywords: string[];

  @Prop({ required: true })
  mapX: number;

  @Prop({ required: true })
  mapY: number;

  @Prop()
  address: string;

  @Prop({ default: false })
  isShared: boolean;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;
}

export const PickPlaceSchema = SchemaFactory.createForClass(PickPlace);
