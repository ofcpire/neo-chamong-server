import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuid } from 'uuid';
import * as _ from 'mongoose-lean-virtuals';

@Schema({
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
})
export class Member extends Document {
  @Prop({ default: uuid, unique: true })
  id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true, default: '차몽인' })
  nickname: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'default_profile_img.png' })
  imgName: string;

  @Prop({ default: '자기 소개를 입력해주세요.' })
  about: string;

  @Prop({ default: '정보 없음' })
  carName: string;

  @Prop({ default: '정보 없음' })
  oilInfo: string;

  @Prop({ type: Date })
  createdAt: Date;

  @Prop({ type: Date })
  updatedAt: Date;

  readonly profileImg: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);

MemberSchema.plugin(_.mongooseLeanVirtuals);
