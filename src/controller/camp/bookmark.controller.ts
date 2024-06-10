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
import { JwtAuthGuard } from 'src/lib/interceptor/auth.guard';
import { BookmarkService } from 'src/service/camp/bookmark.service';
import { InterceptedRequest } from 'src/types/members';
import { Response as Res } from 'express';
import { WishlistService } from 'src/service/camp/wishlist.service';
import { WrapContentInterceptor } from 'src/lib/interceptor/wrap-content.interceptor';

@Controller('bookmark')
export class BookmarkController {
  constructor(
    private readonly bookmarkService: BookmarkService,
    private readonly wishlistService: WishlistService,
  ) {}
  private readonly logger = new Logger(BookmarkController.name);

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(WrapContentInterceptor)
  async getBookmarkedCamp(@Request() req: InterceptedRequest) {
    this.logger.log('Get /bookmark');
    return await this.wishlistService.getBookmarkedCampsByMemberId(
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
