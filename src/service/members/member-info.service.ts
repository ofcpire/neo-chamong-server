import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from 'src/lib/dbBase/schema/memberSchema';

@Injectable()
export class MemberInfoService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<Member>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async getMemberInfoByEmail(email: string) {
    const memberInfo = await this.memberModel.findOne({
      email: email,
    });
    memberInfo.password = undefined;
    return memberInfo;
  }
}
