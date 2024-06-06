import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Member extends Document {
  @Prop()
  id: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true, default: '차몽인' })
  nickname: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  profileImg: string;

  @Prop({ default: '자기 소개를 입력해주세요.' })
  about: string;

  @Prop({ default: '정보 없음' })
  carName: string;

  @Prop({ default: '정보 없음' })
  oilInfo: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
