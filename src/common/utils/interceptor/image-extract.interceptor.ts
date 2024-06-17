import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { v4 as uuid } from 'uuid';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';

@Injectable()
export class ImageExtractInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    call: CallHandler,
  ): Promise<Observable<any>> {
    const req = await context.switchToHttp().getRequest();
    if (!req.files) return call.handle();
    const imageFile = req.files.find((file: Express.Multer.File) =>
      file.mimetype.includes('image'),
    ) as Express.Multer.File;
    if (imageFile) {
      if (!this.checkType(imageFile.originalname))
        throw new BadRequestException('Only accept jpg, jpeg or png');
      if (imageFile.buffer.length > 3 * 1024 * 1024)
        throw new BadRequestException('Too big image');

      const imageName = 'image-' + uuid() + '.' + imageFile.originalname;
      const newPath = './image/' + imageName;
      try {
        fs.writeFileSync(newPath, imageFile.buffer, {});
        req.body.imgName = imageName;
      } catch (err) {
        Logger.error(err);
        throw new InternalServerErrorException('Failed to save image');
      }
    } else req.body.imgSrc = null;
    return call.handle();
  }

  async checkType(originalname: string) {
    return (
      originalname === 'png' ||
      originalname === 'jpg' ||
      originalname === 'jpeg'
    );
  }
}
