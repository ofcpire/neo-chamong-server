import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { searchfields, areas, themes } from 'src/camp/campVariables';
import { CampService } from '../camp/camp.service';
import { CampRepository } from '../camp/camp.repository';

@Injectable()
export class MainService {
  constructor(
    private readonly campService: CampService,
    private readonly campRepository: CampRepository,
  ) {}
  private readonly logger = new Logger(MainService.name);

  async getCampByPage(page: number = 1, size: number = 30, memberId: string) {
    const campData = await this.campRepository.fetchCampListByPage(
      {},
      page,
      size,
    );

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
    size: number,
    memberId: string,
  ) {
    const keywords = await this.campRepository.fetchCampKeyword(keywordId);
    if (!keywords) return [];

    const campData = this.getCampDataBySearch(
      keywords.keyword,
      null,
      null,
      page,
      size,
      memberId,
    );
    return campData;
  }

  async getCampDataBySearch(
    searchKeyword: string[],
    areaId: number | null = null,
    themeId: number | null = null,
    page: number = 1,
    size: number = 30,
    memberId: string,
  ) {
    try {
      if (themeId) searchKeyword = [...searchKeyword, themes[themeId]];
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
      const campData = await this.campRepository.fetchCampListByPage(
        queryOption,
        page,
        size,
      );
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
