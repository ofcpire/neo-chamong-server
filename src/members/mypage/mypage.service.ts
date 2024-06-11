import { Injectable } from '@nestjs/common';
import { MemberInfoService } from '../member-info.service';

@Injectable()
export class MypageService {
  constructor(private readonly memberInfoService: MemberInfoService) {}
  async getMypageByMemberId(memberId: string) {
    return {
      memberInfo: await this.memberInfoService.getMemberInfoById(memberId),
      myPlaceInfos: [],
      visitedPlaceInfos: [],
      writtenArticleInfos: [],
      commentedArticleInfos: [],
      likedArticleInfos: [],
    };
  }
}
