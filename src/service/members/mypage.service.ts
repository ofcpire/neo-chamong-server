import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class MypageService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async getMypage(email: string) {}
}
