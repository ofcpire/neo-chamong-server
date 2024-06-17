import { Module } from '@nestjs/common';
import { MembersController } from 'src/members/members.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from './member.schema';
import { MemberService } from './member.service';
import { MemberRepository } from './member.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    AuthModule,
  ],
  controllers: [MembersController],
  providers: [MemberService, MemberRepository],
  exports: [
    MemberService,
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    MemberRepository,
  ],
})
export class MembersModule {}
