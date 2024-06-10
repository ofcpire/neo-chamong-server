import { Module } from '@nestjs/common';
import { MembersController } from 'src/controller/members/members.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from 'src/lib/dbBase/schema/memberSchema';
import { MypageModule } from './mypage.module';
import { AuthModule } from '../auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    MypageModule,
    AuthModule,
  ],
  controllers: [MembersController],
})
export class MembersModule {}
