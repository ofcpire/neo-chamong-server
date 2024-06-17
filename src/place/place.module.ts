import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PickPlace, PickPlaceSchema } from './pick-places/pick-places.schema';
import { AuthModule } from '../auth/auth.module';
import { PickPlaceModule } from './pick-places/pick-places.module';

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
