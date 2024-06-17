import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { MemberService } from '../member.service';
import { PickPlacesService } from 'src/place/pick-places/pick-places.service';
import { ArticlesService } from 'src/articles/articles.service';
import { BookmarkService } from 'src/camp/bookmark/bookmark.service';
import { ReviewService } from 'src/camp/review/review.service';
import { CampService } from 'src/camp/camp.service';
import { PatchMemberDto } from '../../mypage/dto/patch-member.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from '../member.schema';
import { Model } from 'mongoose';

@Injectable()
export class MypageService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<Member>,
    private readonly memberService: MemberService,
    private readonly pickPlaceService: PickPlacesService,
    private readonly articlesService: ArticlesService,
    private readonly bookmarkService: BookmarkService,
    private readonly reviewService: ReviewService,
    private readonly campService: CampService,
  ) {}
  async getMypageByMemberId(memberId: string) {
    try {
      return {
        memberInfo: await this.memberService.getMemberInfoById(memberId),
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

  async patchMemberProfile(PatchMemberDto: PatchMemberDto, memberId) {
    try {
      return await this.memberModel.updateOne(
        { id: memberId },
        {
          ...PatchMemberDto,
        },
      );
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
