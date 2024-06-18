import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Member } from './member.schema';
import { NotFoundException } from '@nestjs/common';
import { PatchMemberDto } from 'src/members/dto/patch-member.dto';

@Injectable()
export class MemberRepository {
  constructor(
    @InjectModel(Member.name) private readonly memberModel: Model<Member>,
  ) {}
  async fetchMemberInfoWithPasswordByEmail(email: string) {
    try {
      const memberInfo = await this.memberModel
        .findOne({
          email,
        })
        .lean();
      return memberInfo;
    } catch (err) {
      Logger.error(err);
      throw new Error(err);
    }
  }

  async fetchMemberInfoById(id: string) {
    const memberInfo = await this.memberModel
      .findOne({
        id,
      })
      .lean();
    if (!memberInfo) throw new NotFoundException();
    else {
      memberInfo.password = undefined;
      return memberInfo;
    }
  }

  async saveNewMember(
    nickname: string,
    email: string,
    encryptedPassword: string,
  ) {
    try {
      const memberClass = new this.memberModel({
        email,
        nickname,
        password: encryptedPassword,
        profileImg: null,
        about: '자기소개를 입력해주세요.',
        carName: '',
        oilInfo: null,
      });
      await memberClass.save().catch((err) => {
        Logger.log('Error : ' + err);
      });
      return true;
    } catch (err) {
      Logger.error(err);
      throw new Error(err);
    }
  }

  async patchMember(patchMemberDto: PatchMemberDto, memberId: string) {
    return await this.memberModel.updateOne(
      { id: memberId },
      {
        $set: { ...PatchMemberDto },
      },
    );
  }
}
