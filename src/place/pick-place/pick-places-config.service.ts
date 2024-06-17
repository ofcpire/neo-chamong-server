import { Injectable } from '@nestjs/common';
import { SchemaUtilHelper } from 'src/common/utils/utils/schema-util.helper';
import { PickPlace, PickPlaceSchema } from './pick-place.schema';
import * as _ from 'mongoose-lean-virtuals';
const schemaUtilHelper = new SchemaUtilHelper();

@Injectable()
export class PickPlacesConfigService {
  public schemaConfiguration() {
    PickPlaceSchema.plugin(_.mongooseLeanVirtuals);
    PickPlaceSchema.virtual('placeImg').get(function (this: PickPlace) {
      if (this.imgName) return schemaUtilHelper.getFullImgAddress(this.imgName);
      else return null;
    });
  }
}
