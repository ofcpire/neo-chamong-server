import {
  Controller,
  Get,
  Query,
  Param,
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { MainService } from 'src/service/camp/main.service';
import { WrapContentInterceptor } from 'src/lib/interceptor/wrap-content.interceptor';

@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}
  private readonly logger = new Logger(MainController.name);

  @Get('/')
  @UseInterceptors(WrapContentInterceptor)
  async getCampList(
    @Query('page') page: number = 1,
    @Query('row') row: number = 30,
  ) {
    this.logger.log(`/main page=${page} row=${row}`);
    const data = await this.mainService.getCampByPage(page, row);
    return data;
  }
  @Get('/:contentId')
  async getCamp(@Param('contentId') contentId: number) {
    this.logger.log(`/main/${contentId}`);
    const data = await this.mainService.getCampByContentId(contentId);
    return data;
  }

  @Get('/search/keyword/:keywordId')
  async getCampByKeywordId(
    @Param('keywordId') keywordId: number = 1,
    @Query('page') page: number = 1,
    @Query('row') row: number = 30,
  ) {
    this.logger.log(`/main/search/keyword/${keywordId}`);
    const data = await this.mainService.getCampByKeywordId(
      keywordId,
      page,
      row,
    );
    return data;
  }

  @Get('/search/:areaId/:themeId')
  async getCampBySearch(
    @Param('areaId') areaId: number = 0,
    @Param('themeId') themeId: number = 0,
    @Query('keyword') keyword: string,
    @Query('page') page: number = 1,
    @Query('row') row: number = 30,
  ) {
    this.logger.log(`main/search/${areaId}/${themeId}?keyword=${keyword}`);
    const data = this.mainService.getCampDataBySearch(
      [keyword],
      areaId,
      themeId,
      page,
      row,
    );
    return data;
  }
}
