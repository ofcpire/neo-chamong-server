import { Controller, Get, Query, Param, Logger } from '@nestjs/common';
import { campingListModel } from 'src/lib/dbBase/model/campingModel';

@Controller('main')
export class MainController {
  private readonly logger = new Logger(MainController.name);
  @Get('/')
  async getCampingList(
    @Query('page') page: number = 1,
    @Query('row') row: number = 30,
  ) {
    this.logger.log(`/main page=${page} row=${row}`);
    try {
      const skip = (page - 1) * row;
      const campingData = await campingListModel.find({}).skip(skip).limit(row);
      const data = {
        content: campingData,
      };
      return data;
    } catch (err) {
      this.logger.error(err);
    }
  }
  @Get('/:contentId')
  async getCamping(@Param('contentId') contentId: string) {
    this.logger.log(`/main/${contentId}`);
    try {
      const campingData = await campingListModel.findOne({
        contentId: contentId,
      });
      return campingData;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
