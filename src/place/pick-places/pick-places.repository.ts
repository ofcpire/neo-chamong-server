import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PickPlace } from './pick-places.schema';
import { Model } from 'mongoose';
import { CreatePickPlaceDto } from './dto/pick-places.dto';

@Injectable()
export class PickPlaceRepository {
  constructor(
    @InjectModel(PickPlace.name) private pickPlaceModel: Model<PickPlace>,
  ) {}

  async createNewPickPlace(
    createPickPlaceDto: CreatePickPlaceDto,
    memberId: string,
  ) {
    const newPickPlace = new this.pickPlaceModel({
      ...createPickPlaceDto,
      memberId,
    });
    return await newPickPlace.save();
  }

  async fetchSinglePickPlaceByMyPlaceId(id: string) {
    return await this.pickPlaceModel.findOne({ id });
  }

  async patchSinglePickPlace(
    id: string,
    createPickPlaceDto: CreatePickPlaceDto,
  ) {
    return await this.pickPlaceModel.updateOne(
      { id },
      {
        ...createPickPlaceDto,
      },
    );
  }

  async deletePickPlace(id: string) {
    return await this.pickPlaceModel.deleteOne({ id });
  }

  async fetchPickPlaces(query: { memberId?: string; isShared?: boolean }) {
    return await this.pickPlaceModel.find(query);
  }
}
