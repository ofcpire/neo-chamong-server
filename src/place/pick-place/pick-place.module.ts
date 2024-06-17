import { Module } from '@nestjs/common';
import { PickPlacesService } from 'src/place/pick-place/pick-places.service';
import { PickPlaceController } from 'src/place/pick-place/pick-places.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PickPlace, PickPlaceSchema } from './pick-place.schema';
import { AuthModule } from 'src/auth/auth.module';
import { PickPlaceRepository } from './pick-place.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PickPlace.name, schema: PickPlaceSchema },
    ]),
    AuthModule,
  ],
  controllers: [PickPlaceController],
  providers: [PickPlacesService, PickPlaceRepository],
  exports: [PickPlacesService, PickPlaceRepository],
})
export class PickPlaceModule {}
