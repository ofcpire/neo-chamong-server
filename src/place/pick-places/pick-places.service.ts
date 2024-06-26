import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePickPlaceDto } from './dto/pick-places.dto';
import { PickPlaceRepository } from './pick-places.repository';
import { PickPlacesConfigService } from './pick-places-config.service';

@Injectable()
export class PickPlacesService {
  constructor(
    private readonly pickPlaceRepository: PickPlaceRepository,
    private readonly pickPlaceConfigService: PickPlacesConfigService,
  ) {
    this.pickPlaceConfigService.schemaConfiguration();
  }
  async postPickPlaces(
    createPickPlaceDto: CreatePickPlaceDto,
    memberId: string,
  ) {
    try {
      return await this.pickPlaceRepository.createNewPickPlace(
        createPickPlaceDto,
        memberId,
      );
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async patchPickPlaces(
    createPickPlaceDto: CreatePickPlaceDto,
    myPlaceId: string,
    memberId: string,
  ) {
    const existPickPlace =
      await this.pickPlaceRepository.fetchSinglePickPlaceByMyPlaceId(myPlaceId);
    if (!existPickPlace) throw new NotFoundException();
    if (existPickPlace.memberId !== memberId) throw new UnauthorizedException();
    try {
      return await this.pickPlaceRepository.patchSinglePickPlace(
        myPlaceId,
        createPickPlaceDto,
      );
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async deletePickPlaces(myPlaceId: string, memberId: string) {
    const existPickPlace =
      await this.pickPlaceRepository.fetchSinglePickPlaceByMyPlaceId(myPlaceId);
    if (!existPickPlace) throw new NotFoundException();
    if (existPickPlace.memberId !== memberId) throw new UnauthorizedException();
    try {
      return await this.pickPlaceRepository.deletePickPlace(myPlaceId);
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async getMyPickPlaces(memberId: string) {
    return await this.pickPlaceRepository.fetchPickPlaces({ memberId });
  }

  async getSharedPickPlaces() {
    return await this.pickPlaceRepository.fetchPickPlaces({ isShared: true });
  }
}
