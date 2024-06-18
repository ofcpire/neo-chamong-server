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
import { InterceptedRequest } from 'src/members/members';
import { MypageService } from './mypage.service';

@Controller('members')
@UseGuards(JwtAuthGuard)
export class MypageController {
  constructor(private readonly mypageService: MypageService) {}
  private readonly logger = new Logger(MypageController.name);

  @Get('/mypage')
  @UseGuards(JwtAuthGuard)
  async login(@Response() res: Res, @Request() req: InterceptedRequest) {
    this.logger.log('members/mypage');
    const data = await this.mypageService.getMypageByMemberId(req.user?.id);
    res.send(data);
  }
}
