import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { PickPlacesService } from 'src/place/pick-places/pick-places.service';
import { ArticlesService } from 'src/articles/articles.service';
import { CampService } from 'src/camp/camp.service';
import { MemberRepository } from 'src/members/member.repository';

@Injectable()
export class MypageService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly pickPlaceService: PickPlacesService,
    private readonly articlesService: ArticlesService,
    private readonly campService: CampService,
  ) {}
  async getMypageByMemberId(memberId: string) {
    try {
      return {
        memberInfo: await this.memberRepository.fetchMemberInfoById(memberId),
        myPlaceInfos: await this.pickPlaceService.getMyPickPlaces(memberId),
        visitedPlaceInfos:
          await this.campService.getReviewedCampsByMemberId(memberId),
        writtenArticleInfos:
          await this.articlesService.getArticlesByMemberId(memberId),
        commentedArticleInfos:
          await this.articlesService.getCommentedArticlesByMemberId(memberId),
        likedArticleInfos:
          await this.articlesService.getLikedArticlesByMemberId(memberId),
      };
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
