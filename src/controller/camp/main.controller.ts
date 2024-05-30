import { Controller, Get, Query, Param, Logger } from '@nestjs/common';
import { campListModel } from 'src/lib/dbBase/model/campModel';
import { MainService } from 'src/service/camp/main.service';

@Controller('main')
export class MainController {
  constructor(private readonly mainService: MainService) {}
  private readonly logger = new Logger(MainController.name);
  @Get('/')
  async getCampList(
    @Query('page') page: number = 1,
    @Query('row') row: number = 30,
  ) {
    this.logger.log(`/main page=${page} row=${row}`);
    const data = await this.mainService.getCampByPage(page, row);
    return data;
  }
  @Get('/:contentId')
  async getCamp(@Param('contentId') contentId: string) {
    this.logger.log(`/main/${contentId}`);
    try {
      const campData = await campListModel.findOne({
        contentId: contentId,
      });
      return campData;
    } catch (err) {
      this.logger.error(err);
    }
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
