import {
  Controller,
  Get,
  Logger,
  Response,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { InterceptedRequest } from '../members';
import { MypageService } from 'src/members/mypage/mypage.service';

@Controller('members')
@UseGuards(JwtAuthGuard)
export class MypageController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly mypageService: MypageService,
  ) {}
  private readonly logger = new Logger(MypageController.name);

  @Get('/mypage')
  @UseGuards(JwtAuthGuard)
  async login(@Response() res: Res, @Request() req: InterceptedRequest) {
    this.logger.log('members/mypage');
    const data = await this.mypageService.getMypageByMemberId(req.user?.id);
    res.send(data);
  }
}
