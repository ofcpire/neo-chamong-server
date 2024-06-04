import {
  Controller,
  Get,
  Logger,
  Response,
  UseGuards,
  Request,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { JwtAuthGuard } from 'src/lib/interceptor/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/service/members/auth.service';
import { MemberInfoType, InterceptedRequest } from 'src/types/members';

@Controller('members')
@UseGuards(JwtAuthGuard)
export class MypageController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}
  private readonly logger = new Logger(MypageController.name);

  @Get('/mypage')
  async login(@Response() res: Res, @Request() req: InterceptedRequest) {
    this.logger.log('members/mypage');
    const memberInfo = req.user;
    const data = {
      memberInfo,
      myPlaceInfos: [],
      visitedPlaceInfos: [],
      writtenArticleInfos: [],
      commentedArticleInfos: [],
      likedArticleInfos: [],
    };
    res.send(data);
  }
}
