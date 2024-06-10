import { Module } from '@nestjs/common';
import { PickPlacesService } from 'src/service/place/pick-places.service';
import { PickPlaceController } from 'src/controller/place/pick-places.controller';
import { FormdataService } from 'src/service/util/formdata.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  PickPlace,
  PickPlaceSchema,
} from 'src/lib/dbBase/schema/pickPlaceSchema';
import { AuthModule } from './auth.module';

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
export class PlaceModule {}
