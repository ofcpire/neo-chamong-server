import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import {
  campListModel,
  campKeywordModel,
} from 'src/lib/dbBase/model/campModel';
import { searchfields, areas, themes } from 'src/lib/variables/campVariables';

@Injectable()
export class MainService {
  constructor() {}
  private readonly logger = new Logger(MainService.name);
  async getCampByPage(page: number = 1, row: number = 30) {
    const skip = (page - 1) * row;
    const campData = await campListModel.find({}).skip(skip).limit(row);
    const data = {
      content: campData,
    };
    return data;
  }

  async getCampByKeywordId(keywordId: number = 1, page: number, row: number) {
    const keywords = await campKeywordModel.findOne({
      keywordId: keywordId,
    });
    if (!keywords) return [];

    const campData = this.getCampDataBySearch(
      keywords.keyword,
      null,
      null,
      page,
      row,
    );
    return campData;
  }

  async getCampDataBySearch(
    searchKeyword: string[],
    areaId: number | null = null,
    themeId: number | null = null,
    page: number = 1,
    row: number = 30,
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

      const campData = await campListModel
        .find(queryOption)
        .skip(skip)
        .limit(row);
      return campData;
    } catch (err) {
      this.logger.error(err);
      throw new BadGatewayException(err);
    }
  }
}
