import {
  StreamableFile,
  Injectable,
  BadRequestException,
  NotFoundException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { join, normalize } from 'path';
import { ImageHelper } from 'src/common/helper/image.helper';

@Injectable()
export class ImageService {
  constructor(private readonly imageHelper: ImageHelper) {}
  public getImage(imageName: string) {
    const typeRegex = /\.(png|jpg|jpeg)$/i;
    if (
      imageName.includes('/') ||
      imageName.includes('..') ||
      !typeRegex.test(imageName)
    )
      throw new BadRequestException();
    const imagePath = this.imageHelper.joinImagePath(imageName);
    try {
      const normalizedPath = normalize(imagePath);

      if (!existsSync(normalizedPath)) {
        throw new NotFoundException();
      }

      const file = createReadStream(imagePath);
      return new StreamableFile(file);
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
