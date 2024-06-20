import { Injectable } from '@nestjs/common';
import { join } from 'path';

@Injectable()
export class PathHelper {
  public readonly rootDir: string;
  constructor() {
    this.rootDir = join(__dirname, '..', '..', '..');
  }
}
