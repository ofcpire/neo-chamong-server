import { Injectable } from '@nestjs/common';
import { SchemaUtilHelper } from 'src/common/helper/schema-util.helper';
import { PickPlace, PickPlaceSchema } from './pick-places.schema';

@Injectable()
export class PickPlacesConfigService {
  constructor(private readonly schemaUtilHelper: SchemaUtilHelper) {}
  public schemaConfiguration() {
    const schemaUtilHelper = this.schemaUtilHelper;
    PickPlaceSchema.virtual('placeImg').get(function (this: PickPlace) {
      if (this.imgName) return schemaUtilHelper.getFullImgAddress(this.imgName);
      else return null;
    });
  }
}
