import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SchemaUtilHelper {
  constructor(private readonly configService: ConfigService) {}
  public getFullImgAddress(imgName: string) {
    const imgBaseUrl = this.configService.get('IMG_BASE_URL');
    if (!imgName) return null;
    return `${imgBaseUrl}/${imgName}`;
  }
}
