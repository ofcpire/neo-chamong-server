import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ReviewService } from '../camp/review.service';
import { MemberInfoService } from './member-info.service';

@Injectable()
export class MypageService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reviewService: ReviewService,
    private readonly memberInfoService: MemberInfoService,
  ) {}
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
