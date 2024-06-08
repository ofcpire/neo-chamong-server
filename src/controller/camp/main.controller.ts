import {
  Controller,
  Get,
  Query,
  Param,
  Logger,
  UseInterceptors,
  UseGuards,
  Request,
} from '@nestjs/common';
import { MainService } from 'src/service/camp/main.service';
import { WrapContentInterceptor } from 'src/lib/interceptor/wrap-content.interceptor';
import { OptionalAuthGuard } from 'src/lib/interceptor/optional-auth.interceptor';
import { InterceptedRequest } from 'src/types/members';

@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}
  private readonly logger = new Logger(MainController.name);

  @Get('/')
  @UseGuards(OptionalAuthGuard)
  @UseInterceptors(WrapContentInterceptor)
  async getCampList(
    @Query('page') page: number = 1,
    @Query('row') row: number = 30,
    @Request() req: InterceptedRequest,
  ) {
    this.logger.log(`/main page=${page} row=${row}`);
    const data = await this.mainService.getCampByPage(page, row, req.user?.id);
    return data;
  }
  @Get('/:contentId')
  @UseGuards(OptionalAuthGuard)
  async getCamp(
    @Param('contentId') contentId: number,
    @Request() req: InterceptedRequest,
  ) {
    this.logger.log(`/main/${contentId}`);
    const data = await this.mainService.getCampByContentId(
      contentId,
      req.user?.id,
    );
    return data;
  }

  @Get('/search/keyword/:keywordId')
  @UseGuards(OptionalAuthGuard)
  async getCampByKeywordId(
    @Param('keywordId') keywordId: number = 1,
    @Query('page') page: number = 1,
    @Query('row') row: number = 30,
    @Request() req: InterceptedRequest,
  ) {
    this.logger.log(`/main/search/keyword/${keywordId}`);
    const data = await this.mainService.getCampByKeywordId(
      keywordId,
      page,
      row,
      req.user?.id,
    );
    return data;
  }

  @Get('/search/:areaId/:themeId')
  @UseGuards(OptionalAuthGuard)
  async getCampBySearch(
    @Param('areaId') areaId: number = 0,
    @Param('themeId') themeId: number = 0,
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
    @Query('row') row: number = 30,
    @Request() req: InterceptedRequest,
  ) {
    this.logger.log(`main/search/${areaId}/${themeId}?keyword=${keyword}`);
    const data = this.mainService.getCampDataBySearch(
      [keyword],
      areaId,
      themeId,
      page,
      row,
      req.user?.id,
    );
    return data;
  }
}
