import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Logger,
  UseGuards,
  Request,
  Response,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { BookmarkService } from 'src/camp/bookmark/bookmark.service';
import { InterceptedRequest } from 'src/members/members';
import { Response as Res } from 'express';
import { BookmarkWishlistService } from 'src/camp/bookmark/bookmark-wishlist.service';
import { WrapContentInterceptor } from 'src/common/interceptor/wrap-content.interceptor';

@Controller('bookmark')
export class BookmarkController {
  constructor(
    private readonly bookmarkService: BookmarkService,
    private readonly bookmarkWishlistService: BookmarkWishlistService,
  ) {}
  private readonly logger = new Logger(BookmarkController.name);

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(WrapContentInterceptor)
  async getBookmarkedCamp(@Request() req: InterceptedRequest) {
    this.logger.log('Get /bookmark');
    return await this.bookmarkWishlistService.getBookmarkedCampsByMemberId(
      req.user?.id,
    );
  }

  @Post('/:contentId')
  @UseGuards(JwtAuthGuard)
  async postBookmark(
    @Param('contentId') contentId: number,
    @Request() req: InterceptedRequest,
    @Response() res: Res,
  ) {
    this.logger.log(`Post /bookmark/${contentId}`);
    const result = await this.bookmarkService.postBookmark(
      contentId,
      req.user.id,
    );
    res.status(201).send(result);
  }

  @Delete('/:bookmarkId')
  @UseGuards(JwtAuthGuard)
  async deleteBookmark(
    @Param('bookmarkId') bookmarkId: string,
    @Request() req: InterceptedRequest,
    @Response() res: Res,
  ) {
    this.logger.log(`Delete /bookmark/${bookmarkId}`);
    await this.bookmarkService.deleteBookmark(bookmarkId, req.user?.id);
    res.status(204).send();
  }
}
