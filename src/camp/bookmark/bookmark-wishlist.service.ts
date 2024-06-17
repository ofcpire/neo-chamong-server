import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bookmark } from './bookmark.schema';
import { CampRepository } from '../camp.repository';
@Injectable()
export class BookmarkWishlistService {
  constructor(
    @InjectModel(Bookmark.name) private bookmarkModel: Model<Bookmark>,
    private readonly campRepository: CampRepository,
  ) {}
  async getBookmarkedCampsByMemberId(memberId: string) {
    try {
      const contentIdList = (
        await this.bookmarkModel.find({ memberId }).lean()
      ).map((bookmark) => bookmark.contentId);
      const campsData = await Promise.all(
        contentIdList.map(
          async (contentId) =>
            await this.campRepository.fetchCampByContentId(contentId),
        ),
      );
      return campsData;
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
