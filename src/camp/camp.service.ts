import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CampList } from './campSchema';
import { Model } from 'mongoose';
import { BookmarkService } from './bookmark/bookmark.service';
import { ReviewService } from './review/review.service';

@Injectable()
export class CampService {
  constructor(
    @InjectModel(CampList.name) private campListModel: Model<CampList>,
    private readonly bookmarkService: BookmarkService,
    private readonly reviewService: ReviewService,
  ) {}

  async getCampByContentId(contentId: number, memberId: string) {
    const campData = await this.campListModel.findOne({ contentId }).lean();
    const reviews =
      await this.reviewService.getReviewsForContentByContentId(contentId);
    const campDataWithBookmarkInfo = await this.addBookmarkToCampByMemberId(
      campData,
      memberId,
    );
    return {
      ...campDataWithBookmarkInfo,
      reviews,
    };
  }

  async addBookmarkToCampArrayByMemberId(
    campListArray: CampList[],
    memberId: string,
  ) {
    if (!memberId) return campListArray;
    const campListWithBookmarkInfo = await Promise.all(
      campListArray.map(async (camp) => {
        return await this.addBookmarkToCampByMemberId(camp, memberId);
      }),
    );
    return campListWithBookmarkInfo;
  }

  async addBookmarkToCampByMemberId(camp: CampList, memberId: string) {
    if (!memberId) return camp;
    const isBookmarked =
      await this.bookmarkService.getBookmarkByContentIdAndMemberId(
        camp.contentId,
        memberId,
      );
    return {
      ...camp,
      bookmarked: !!isBookmarked,
      bookmarkId: isBookmarked ? isBookmarked.bookmarkId : undefined,
    };
  }
}
