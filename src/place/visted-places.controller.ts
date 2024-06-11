import {
  Controller,
  Post,
  Delete,
  Param,
  Logger,
  Response,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { PickPlacesService } from 'src/place/pick-place/pick-places.service';
import { FormdataService } from 'src/common/utils/services/formdata.service';
import { InterceptedRequest } from 'src/members/members';

@Controller('visited-places')
@UseGuards(JwtAuthGuard)
export class VisitedPlaceController {
  constructor(
    private readonly pickPlaceService: PickPlacesService,
    private readonly formDataService: FormdataService,
  ) {}
  private readonly logger = new Logger(VisitedPlaceController.name);

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async postPickPlaces(
    @Response() res: Res,
    @Request() req: InterceptedRequest,
  ) {
    return res.status(201).send();
  }
}
