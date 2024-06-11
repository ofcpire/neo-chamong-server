import { Module } from '@nestjs/common';
import { MembersController } from 'src/members/members.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from './member.schema';
import { MypageModule } from './mypage/mypage.module';
import { AuthModule } from '../auth/auth.module';
import { MemberInfoService } from './member-info.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    MypageModule,
    AuthModule,
  ],
  controllers: [MembersController],
  providers: [MemberInfoService],
  exports: [MemberInfoService],
})
export class MembersModule {}
