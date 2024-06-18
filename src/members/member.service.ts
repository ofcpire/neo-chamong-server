import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { MemberConfigService } from './member-config.service';
import { MemberRepository } from './member.repository';
import { PatchMemberDto } from 'src/members/dto/patch-member.dto';

@Injectable()
export class MemberService {
  constructor(
    private memberConfigService: MemberConfigService,
    private memberRepository: MemberRepository,
  ) {
    this.memberConfigService.schemaConfiguration();
  }

  async getMemberInfoById(id: string) {
    const memberInfo = await this.memberRepository.fetchMemberInfoById(id);
    if (!memberInfo) throw new NotFoundException();
    return memberInfo;
  }

  async getMemberInfoForArticleById(id: string) {
    const memberInfo = await this.memberRepository.fetchMemberInfoById(id);
    return {
      nickname: memberInfo.nickname,
      profileImg: memberInfo.profileImg,
      carName: memberInfo.carName,
      about: memberInfo.about,
      oilInfo: memberInfo.oilInfo,
      memberId: memberInfo.id,
    };
  }

  async createAccount(
    nickname: string,
    email: string,
    encryptedPassword: string,
  ) {
    if (!nickname || !email) {
      throw new BadRequestException();
    }
    const isMemberExist =
      await this.memberRepository.fetchMemberInfoWithPasswordByEmail(email);
    if (!isMemberExist) {
      await this.memberRepository.saveNewMember(
        nickname,
        email,
        encryptedPassword,
      );
      return email;
    } else throw new ConflictException();
  }

  async patchMemberProfile(patchMemberDto: PatchMemberDto, memberId) {
    try {
      return await this.memberRepository.patchMember(patchMemberDto, memberId);
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
