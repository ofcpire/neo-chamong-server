import { Module } from '@nestjs/common';
import { PickPlacesService } from 'src/place/pick-place/pick-places.service';
import { PickPlaceController } from 'src/place/pick-place/pick-places.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PickPlace, PickPlaceSchema } from './pick-place.schema';
import { AuthModule } from 'src/auth/auth.module';
import { PickPlaceRepository } from './pick-place.repository';
import { PickPlacesConfigService } from './pick-places-config.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PickPlace.name, schema: PickPlaceSchema },
    ]),
    AuthModule,
  ],
  controllers: [PickPlaceController],
  providers: [PickPlacesService, PickPlaceRepository, PickPlacesConfigService],
  exports: [PickPlacesService, PickPlaceRepository, PickPlacesConfigService],
})
export class PickPlaceModule {}
