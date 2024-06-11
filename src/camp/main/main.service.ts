import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CampKeyword, CampList } from 'src/camp/campSchema';
import { searchfields, areas, themes } from 'src/camp/campVariables';
import { Model } from 'mongoose';
import { ReviewService } from '../review/review.service';
import { BookmarkService } from '../bookmark/bookmark.service';
import { CampService } from '../camp.service';

@Injectable()
export class MainService {
  constructor(
    @InjectModel(CampList.name) private campListModel: Model<CampList>,
    @InjectModel(CampKeyword.name) private campKeywordModel: Model<CampKeyword>,
    private readonly reviewService: ReviewService,
    private readonly bookmarkService: BookmarkService,
    private readonly campService: CampService,
  ) {}
  private readonly logger = new Logger(MainService.name);

  async getCampByPage(page: number = 1, row: number = 30, memberId: string) {
    const skip = (page - 1) * row;
    const campData = await this.campListModel
      .find({})
      .skip(skip)
      .limit(row)
      .lean();

    const campDataWithIsliked =
      await this.campService.addBookmarkToCampArrayByMemberId(
        campData,
        memberId,
      );

    return campDataWithIsliked;
  }

  async getCampByKeywordId(
    keywordId: number = 1,
    page: number,
    row: number,
    memberId: string,
  ) {
    const keywords = await this.campKeywordModel.findOne({
      keywordId: keywordId,
    });
    if (!keywords) return [];

    const campData = this.getCampDataBySearch(
      keywords.keyword,
      null,
      null,
      page,
      row,
      memberId,
    );
    return campData;
  }

  async getCampDataBySearch(
    searchKeyword: string[],
    areaId: number | null = null,
    themeId: number | null = null,
    page: number = 1,
    row: number = 30,
    memberId: string,
  ) {
    try {
      if (themeId) searchKeyword = [...searchKeyword, themes[themeId]];
      const skip = (page - 1) * row;
      const regexKeywords = searchKeyword.map(
        (keyword) => new RegExp(keyword, 'i'),
      );
      const keywordQuery = searchfields.map((field) => ({
        [field]: { $in: regexKeywords },
      }));

      const queryOption = {
        $or: keywordQuery,
      };

      if (areaId) {
        const areaQuery = {
          addr1: { $in: areas[areaId].map((area) => new RegExp(area, 'i')) },
        };
        queryOption['$and'] = [areaQuery];
      }

      const campData = await this.campListModel
        .find(queryOption)
        .skip(skip)
        .limit(row)
        .lean();
      return await this.campService.addBookmarkToCampArrayByMemberId(
        campData,
        memberId,
      );
    } catch (err) {
      this.logger.error(err);
      throw new BadGatewayException(err);
    }
  }
}
