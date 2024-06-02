import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { memberModel } from 'src/lib/dbBase/model/memberModel';

@Injectable()
export class MemberInfoService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async getMemberInfoByEmail(email: string) {
    const memberInfo = await memberModel.findOne({
      email: email,
    });
    memberInfo.password = undefined;
    return memberInfo;
  }
}
