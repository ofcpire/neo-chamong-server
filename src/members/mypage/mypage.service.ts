import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MemberInfoService } from '../member-info.service';
import { PickPlacesService } from 'src/place/pick-place/pick-places.service';
import { ArticlesService } from 'src/articles/articles.service';
import { BookmarkService } from 'src/camp/bookmark/bookmark.service';
import { ReviewService } from 'src/camp/review/review.service';
import { CampService } from 'src/camp/camp.service';

@Injectable()
export class MypageService {
  constructor(
    private readonly memberInfoService: MemberInfoService,
    private readonly pickPlaceService: PickPlacesService,
    private readonly articlesService: ArticlesService,
    private readonly bookmarkService: BookmarkService,
    private readonly reviewService: ReviewService,
    private readonly campService: CampService,
  ) {}
  async getMypageByMemberId(memberId: string) {
    try {
      return {
        memberInfo: await this.memberInfoService.getMemberInfoById(memberId),
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
