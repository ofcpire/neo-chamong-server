import { Injectable } from '@nestjs/common';
import { CampList } from './campSchema';
import { BookmarkService } from './bookmark/bookmark.service';
import { ReviewService } from './review/review.service';
import { CampRepository } from './camp.repository';

@Injectable()
export class CampService {
  constructor(
    private readonly bookmarkService: BookmarkService,
    private readonly reviewService: ReviewService,
    private readonly campRepository: CampRepository,
  ) {}

  async getCampByContentId(contentId: number, memberId?: string) {
    const campData = await this.campRepository.fetchCampByContentId(contentId);
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

  async getReviewedCampsByMemberId(memberId: string) {
    const contentIdList = (
      await this.reviewService.getReviewesByMemberId(memberId)
    ).map((review) => review.contentId);
    const campData = await Promise.all(
      contentIdList.map(async (contentId) => {
        return await this.getCampByContentId(contentId);
      }),
    );
    return campData;
  }
}
