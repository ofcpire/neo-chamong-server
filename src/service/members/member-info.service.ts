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
  async getMemberInfoById(id: string) {
    const memberInfo = await this.memberModel.findOne({
      id,
    });
    memberInfo.password = undefined;
    return memberInfo;
  }

  async getMemberInfoForArticleById(id: string) {
    const memberInfo = (await this.getMemberInfoById(id)).toObject();
    return {
      nickname: memberInfo.nickname,
      profileImg: memberInfo.profileImg,
      carName: memberInfo.carName,
      about: memberInfo.about,
      oilInfo: memberInfo.oilInfo,
      memberId: memberInfo.id,
    };
  }
}
