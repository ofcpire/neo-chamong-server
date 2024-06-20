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
  Body,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { PickPlacesService } from 'src/place/pick-places/pick-places.service';
import { InterceptedRequest } from 'src/members/members';
import { JsonExtractInterceptor } from 'src/common/interceptor/json-extract.interceptor';
import { CreatePickPlaceDto } from './dto/pick-places.dto';
import { ImageExtractInterceptor } from 'src/common/interceptor/image-extract.interceptor';

@Controller('pick-places')
@UseGuards(JwtAuthGuard)
export class PickPlaceController {
  constructor(private readonly pickPlaceService: PickPlacesService) {}
  private readonly logger = new Logger(PickPlaceController.name);

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    AnyFilesInterceptor(),
    JsonExtractInterceptor,
    ImageExtractInterceptor,
  )
  async postPickPlaces(
    @Response() res: Res,
    @Request() req: InterceptedRequest,
    @Body() CreatePickPlaceDto: CreatePickPlaceDto,
  ) {
    const result = await this.pickPlaceService.postPickPlaces(
      CreatePickPlaceDto,
      req.user.id,
    );
    return res.status(201).send(result);
  }

  @Patch('/:myPlaceId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    AnyFilesInterceptor(),
    JsonExtractInterceptor,
    ImageExtractInterceptor,
  )
  async patchPickPlaces(
    @Response() res: Res,
    @Param('myPlaceId') myPlaceId: string,
    @Request() req: InterceptedRequest,
    @Body() CreatePickPlaceDto: CreatePickPlaceDto,
  ) {
    const result = await this.pickPlaceService.patchPickPlaces(
      CreatePickPlaceDto,
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
