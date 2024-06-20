import { Module } from '@nestjs/common';
import { SchemaUtilHelper } from './schema-util.helper';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [ConfigService, SchemaUtilHelper],
  exports: [SchemaUtilHelper],
})
export class HelperModule {}
