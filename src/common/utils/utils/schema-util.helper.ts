import { Injectable } from '@nestjs/common';
import { config } from 'dotenv';
config();
const imgBaseUrl = process.env.IMG_BASE_URL;

@Injectable()
export class SchemaUtilHelper {
  public getFullImgAddress(imgName: string) {
    if (!imgName) return null;
    return `${imgBaseUrl}/${imgName}`;
  }
}
