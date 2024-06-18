import { Controller, Logger, Get, Param, StreamableFile } from '@nestjs/common';
import { ImageService } from './image.service';
import { createReadStream } from 'fs';
import { join } from 'path';

@Controller('image')
export class ImageController {
  constructor(private readonly imageService: ImageService) {}
  private readonly logger = new Logger(ImageController.name);

  @Get('/:imageName')
  getImage(@Param('imageName') imageName: string): StreamableFile {
    this.logger.log(`Get image/${imageName}`);
    const file = createReadStream(join(process.cwd(), `/image/${imageName}`));
    return new StreamableFile(file);
  }
}
