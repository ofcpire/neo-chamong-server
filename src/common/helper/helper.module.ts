import { Module } from '@nestjs/common';
import { ImageHelper } from './image.helper';
import { SchemaUtilHelper } from './schema-util.helper';
import { ConfigService } from '@nestjs/config';
import { PathHelper } from './path.helper';

@Module({
  providers: [ConfigService, ImageHelper, SchemaUtilHelper, PathHelper],
  exports: [ImageHelper, SchemaUtilHelper],
})
export class HelperModule {}
