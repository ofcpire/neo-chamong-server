import { Injectable } from '@nestjs/common';
import { SchemaUtilHelper } from 'src/common/utils/utils/schema-util.helper';
import { PickPlace, PickPlaceSchema } from './pick-places.schema';
const schemaUtilHelper = new SchemaUtilHelper();

@Injectable()
export class PickPlacesConfigService {
  public schemaConfiguration() {
    PickPlaceSchema.virtual('placeImg').get(function (this: PickPlace) {
      if (this.imgName) return schemaUtilHelper.getFullImgAddress(this.imgName);
      else return null;
    });
  }
}
