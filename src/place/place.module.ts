import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PickPlace, PickPlaceSchema } from './pick-place/pick-place.schema';
import { AuthModule } from '../auth/auth.module';
import { PickPlaceModule } from './pick-place/pick-place.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PickPlace.name, schema: PickPlaceSchema },
    ]),
    AuthModule,
    PickPlaceModule,
  ],
})
export class PlaceModule {}
