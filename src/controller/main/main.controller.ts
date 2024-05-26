import { Controller, Get, Query, Logger } from '@nestjs/common';
import { AppService } from '../../app.service';
import { campingModel } from 'src/lib/dbBase/models';

@Controller('main')
export class MainController {
  constructor(private readonly appService: AppService) {}
  private readonly logger = new Logger(MainController.name);
  @Get('/camping')
  async getHello(@Query('page') page: number) {
    this.logger.log('main/camping');
    try {
      const campingData = await campingModel.find({});
      return campingData;
    } catch (err) {
      this.logger.error(err);
    }
  }
}
