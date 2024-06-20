import { Injectable } from '@nestjs/common';
import { SchemaUtilHelper } from 'src/common/helper/schema-util.helper';
import { Member, MemberSchema } from './member.schema';

@Injectable()
export class MemberConfigService {
  constructor(private readonly schemaUtilHelper: SchemaUtilHelper) {}
  public schemaConfiguration() {
    const schemaUtilHelper = this.schemaUtilHelper;
    MemberSchema.virtual('profileImg').get(function (this: Member) {
      if (this.imgName) return schemaUtilHelper.getFullImgAddress(this.imgName);
      else return null;
    });
  }
}
