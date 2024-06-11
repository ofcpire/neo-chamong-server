import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Logger,
  Response,
  UseGuards,
  Request,
  UseInterceptors,
  Patch,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { PickPlacesService } from 'src/place/pick-place/pick-places.service';
import { FormdataService } from 'src/common/utils/services/formdata.service';
import { InterceptedRequest } from 'src/members/members';

@Controller('pick-places')
@UseGuards(JwtAuthGuard)
export class PickPlaceController {
  constructor(
    private readonly pickPlaceService: PickPlacesService,
    private readonly formDataService: FormdataService,
  ) {}
  private readonly logger = new Logger(PickPlaceController.name);

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async postPickPlaces(
    @Response() res: Res,
    @Request() req: InterceptedRequest,
  ) {
    const result = await this.pickPlaceService.postPickPlaces(
      await this.formDataService.extractFormDataBodyByKey(
        req.files,
        'postMyPlace',
      ),
      req.user.id,
    );
    return res.status(201).send(result);
  }

  @Patch('/:myPlaceId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async patchPickPlaces(
    @Response() res: Res,
    @Param('myPlaceId') myPlaceId: string,
    @Request() req: InterceptedRequest,
  ) {
    const result = await this.pickPlaceService.patchPickPlaces(
      await this.formDataService.extractFormDataBodyByKey(
        req.files,
        'patchMyPlace',
      ),
      myPlaceId,
      req.user.id,
    );
    return res.status(201).send(result);
  }

  @Delete('/:myPlaceId')
  @UseGuards(JwtAuthGuard)
  async deletePickPlaces(
    @Response() res: Res,
    @Param('myPlaceId') myPlaceId: string,
    @Request() req: InterceptedRequest,
  ) {
    return await this.pickPlaceService.deletePickPlaces(
      myPlaceId,
      req.user?.id,
    );
  }

  @Get('/shared')
  async getSharedPickPlaces() {
    return await this.pickPlaceService.getSharedPickPlaces();
  }

  @Get('/member')
  async getMyPickPlaces(@Request() req: InterceptedRequest) {
    return await this.pickPlaceService.getMyPickPlaces(req.user?.id);
  }
}
