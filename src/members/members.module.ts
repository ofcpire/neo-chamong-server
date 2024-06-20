import { Module } from '@nestjs/common';
import { MembersController } from 'src/members/members.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from './member.schema';
import { MemberService } from './member.service';
import { MemberConfigService } from './member-config.service';
import { MemberRepository } from './member.repository';
import { AuthModule } from 'src/auth/auth.module';
import { HelperModule } from 'src/common/helper/helper.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    AuthModule,
    HelperModule,
  ],
  controllers: [MembersController],
  providers: [MemberService, MemberConfigService, MemberRepository],
  exports: [
    MemberService,
    MemberConfigService,
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
    MemberRepository,
  ],
})
export class MembersModule {}
