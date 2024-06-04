import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Member extends Document {
  @Prop()
  id: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  nickname: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  profileImg: string;

  @Prop()
  about: string;

  @Prop()
  car_name: string;

  @Prop()
  oil_info: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
