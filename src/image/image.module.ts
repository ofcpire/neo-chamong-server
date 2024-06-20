import { Module } from '@nestjs/common';
import { ImageController } from './image.controller';
import { ImageService } from './image.service';
import { HelperModule } from 'src/common/helper/helper.module';

@Module({
  imports: [HelperModule],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
