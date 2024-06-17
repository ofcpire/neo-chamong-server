import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { MemberRepository } from './member.repository';

@Injectable()
export class MemberService {
  constructor(private memberRepository: MemberRepository) {}

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
    if (!nickname || !email || !this.emailValidator(email)) {
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

  private emailValidator(email: string) {
    const emailRegex = new RegExp(
      "/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/",
    );
    return emailRegex.test(email);
  }
}
