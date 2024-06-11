import { Injectable, BadRequestException } from '@nestjs/common';
@Injectable()
export class FormdataService {
  constructor() {}
  async extractFormDataBodyByKey(
    files:
      | {
          [fieldname: string]: Express.Multer.File[];
        }
      | Express.Multer.File[],
    key: string,
  ) {
    if (!Array.isArray(files)) throw new BadRequestException();
    const articleString = files.find((e) => e.fieldname === key).buffer;
    if (articleString) {
      const articleBody = JSON.parse(articleString as unknown as string);
      return articleBody;
    } else {
      throw new BadRequestException();
    }
  }
}
