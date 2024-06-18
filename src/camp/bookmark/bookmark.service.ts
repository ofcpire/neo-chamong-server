import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Bookmark } from './bookmark.schema';
@Injectable()
export class BookmarkService {
  constructor(
    @InjectModel(Bookmark.name) private bookmarkModel: Model<Bookmark>,
  ) {}
  async postBookmark(contentId: number, memberId: string) {
    if (await this.bookmarkModel.findOne({ contentId, memberId }))
      throw new ConflictException();
    try {
      const newBookmark = { contentId, memberId };
      const newBookmarkDocument = new this.bookmarkModel(newBookmark);
      return newBookmarkDocument.save();
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async deleteBookmark(bookmarkId: string, memberId: string) {
    const existBookmark = await this.bookmarkModel.findOne({
      bookmarkId,
      memberId,
    });
    if (!existBookmark) throw new NotFoundException();
    return await this.bookmarkModel.deleteOne({ bookmarkId, memberId });
  }

  async getBookmarkByContentIdAndMemberId(contentId: number, memberId: string) {
    return await this.bookmarkModel.findOne({ contentId, memberId }).lean();
  }
}
