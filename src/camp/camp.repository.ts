import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CampList, CampKeyword } from './campSchema';
import { Model, FilterQuery } from 'mongoose';
@Injectable()
export class CampRepository {
  constructor(
    @InjectModel(CampList.name) private campModel: Model<CampList>,
    @InjectModel(CampKeyword.name) private campKeywordModel: Model<CampKeyword>,
  ) {}
  async fetchCampByContentId(contentId: number) {
    return await this.campModel.findOne({ contentId }).lean();
  }

  async fetchCampListByPage(
    query: FilterQuery<CampList>,
    page: number,
    size: number,
  ) {
    const skip = (page - 1) * size;
    return await this.campModel.find(query).skip(skip).limit(size).lean();
  }

  async fetchCampKeyword(keywordId: number) {
    return await this.campKeywordModel.findOne({ keywordId });
  }

  async patchCampAverageRating(contentId: number, averageRating: number) {
    return await this.campModel.updateOne(
      { contentId },
      { $set: { totalRating: averageRating } },
    );
  }
}
