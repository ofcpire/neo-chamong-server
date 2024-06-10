import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bookmark } from 'src/lib/dbBase/schema/bookmarkSchema';
import { MainService } from './main.service';
@Injectable()
export class WishlistService {
  constructor(
    @InjectModel(Bookmark.name) private bookmarkModel: Model<Bookmark>,
    private readonly mainService: MainService,
  ) {}
  async getBookmarkedCampsByMemberId(memberId: string) {
    try {
      const contentIdList = (
        await this.bookmarkModel.find({ memberId }).lean()
      ).map((bookmark) => bookmark.contentId);
      const campsData = await Promise.all(
        contentIdList.map(
          async (contentId) =>
            await this.mainService.getCampByContentId(contentId, memberId),
        ),
      );
      return campsData;
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
