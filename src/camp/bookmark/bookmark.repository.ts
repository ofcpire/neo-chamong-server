import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bookmark } from './bookmark.schema';
import { Model } from 'mongoose';

@Injectable()
export class BookmarkRepository {
  constructor(
    @InjectModel(Bookmark.name) private bookmarkModel: Model<Bookmark>,
  ) {}
  async fetchOneBookmark(query: { bookmarkId?: string }) {}
}
