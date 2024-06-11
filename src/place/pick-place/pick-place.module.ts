import { Module } from '@nestjs/common';
import { PickPlacesService } from 'src/place/pick-place/pick-places.service';
import { PickPlaceController } from 'src/place/pick-place/pick-places.controller';
import { FormdataService } from 'src/common/utils/services/formdata.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PickPlace, PickPlaceSchema } from './pick-place.schema';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PickPlace.name, schema: PickPlaceSchema },
    ]),
    AuthModule,
  ],
  controllers: [PickPlaceController],
  providers: [PickPlacesService, FormdataService],
})
export class PickPlaceModule {}
