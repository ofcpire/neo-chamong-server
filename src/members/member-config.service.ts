import { Injectable } from '@nestjs/common';
import { SchemaUtilHelper } from 'src/common/utils/utils/schema-util.helper';
import { Member, MemberSchema } from './member.schema';
import * as _ from 'mongoose-lean-virtuals';
const schemaUtilHelper = new SchemaUtilHelper();

@Injectable()
export class MemberConfigService {
  public schemaConfiguration() {
    MemberSchema.plugin(_.mongooseLeanVirtuals);
    MemberSchema.virtual('profileImg').get(function (this: Member) {
      if (this.imgName) return schemaUtilHelper.getFullImgAddress(this.imgName);
      else return null;
    });
  }
}
