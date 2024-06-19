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

@Injectable()
export class ImageService {
  public getImage(imageName: string) {
    const typeRegex = /\.(png|jpg|jpeg)$/i;
    if (
      imageName.includes('/') ||
      imageName.includes('..') ||
      !typeRegex.test(imageName)
    )
      throw new BadRequestException();

    try {
      const normalizedPath = normalize(
        join(process.cwd(), 'public', 'image', imageName),
      );

      if (!existsSync(normalizedPath)) {
        throw new NotFoundException();
      }

      const file = createReadStream(
        join(process.cwd(), 'public', 'image', imageName),
      );
      return new StreamableFile(file);
    } catch (err) {
      Logger.error(err);
      throw new InternalServerErrorException();
    }
  }
}
