import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PickPlace } from './pick-place.schema';
import { CreatePickPlaceDto } from './dto/pick-places.dto';

@Injectable()
export class PickPlacesService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectModel(PickPlace.name) private pickPlaceModel: Model<PickPlace>,
  ) {}
  async postPickPlaces(
    CreatePickPlaceDto: CreatePickPlaceDto,
    memberId: string,
  ) {
    try {
      console.log(CreatePickPlaceDto);
      const newPickPlace = new this.pickPlaceModel({
        ...CreatePickPlaceDto,
        memberId,
      });
      const result = await newPickPlace.save();
      return result;
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async patchPickPlaces(
    CreatePickPlaceDto: CreatePickPlaceDto,
    myPlaceId: string,
    memberId: string,
  ) {
    const existPickPlace = await this.pickPlaceModel.findOne({ id: myPlaceId });
    if (!existPickPlace) throw new NotFoundException();
    if (existPickPlace.memberId !== memberId) throw new UnauthorizedException();
    try {
      return await this.pickPlaceModel.updateOne(
        { id: myPlaceId, memberId },
        {
          ...CreatePickPlaceDto,
        },
      );
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async deletePickPlaces(myPlaceId: string, memberId: string) {
    const existPickPlace = await this.pickPlaceModel.findOne({ id: myPlaceId });
    if (!existPickPlace) throw new NotFoundException();
    if (existPickPlace.memberId !== memberId) throw new UnauthorizedException();
    try {
      return await this.pickPlaceModel.deleteOne({ id: myPlaceId, memberId });
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException();
    }
  }

  async getMyPickPlaces(memberId: string) {
    return await this.pickPlaceModel.find({ memberId });
  }

  async getSharedPickPlaces() {
    return await this.pickPlaceModel.find({ isShared: true });
  }
}
