import { Injectable } from '@nestjs/common';
import { join } from 'path';
import { config } from 'dotenv';
import { PathHelper } from './path.helper';
config();

@Injectable()
export class ImageHelper {
  constructor(private readonly pathHelper: PathHelper) {}
  public joinImagePath(imageName: string) {
    return join(this.pathHelper.rootDir, 'public', 'image', imageName);
  }
}
