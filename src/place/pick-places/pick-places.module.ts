import { Module } from '@nestjs/common';
import { PickPlacesService } from 'src/place/pick-places/pick-places.service';
import { PickPlaceController } from 'src/place/pick-places/pick-places.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PickPlace, PickPlaceSchema } from './pick-places.schema';
import { AuthModule } from 'src/auth/auth.module';
import { PickPlaceRepository } from './pick-places.repository';
import { PickPlacesConfigService } from './pick-places-config.service';
import { HelperModule } from 'src/common/helper/helper.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PickPlace.name, schema: PickPlaceSchema },
    ]),
    AuthModule,
    HelperModule,
  ],
  controllers: [PickPlaceController],
  providers: [PickPlacesService, PickPlaceRepository, PickPlacesConfigService],
  exports: [PickPlacesService, PickPlaceRepository, PickPlacesConfigService],
})
export class PickPlaceModule {}
