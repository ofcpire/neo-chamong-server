import { Controller, Logger, Get, Param, StreamableFile } from '@nestjs/common';
import { ImageService } from './image.service';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  private readonly logger = new Logger(ImageController.name);

  @Get('/:imageName')
  getImage(@Param('imageName') imageName: string): StreamableFile {
    this.logger.log(`Get image/${imageName}`);
    return this.imageService.getImage(imageName);
  }
}
