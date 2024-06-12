import {
  Controller,
  Get,
  Patch,
  Logger,
  Response,
  UseGuards,
  Request,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { InterceptedRequest } from '../members';
import { MypageService } from 'src/members/mypage/mypage.service';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { JsonExtractInterceptor } from 'src/common/utils/interceptor/json-extract.interceptor';
import { PatchMemberDto } from '../dto/patch-member.dto';

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

  @Patch()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor(), JsonExtractInterceptor)
  async patchMemberProfile(
    @Request() req: InterceptedRequest,
    @Body() PatchMemberDto: PatchMemberDto,
  ) {
    const result = await this.mypageService.patchMemberProfile(
      PatchMemberDto,
      req.user?.id,
    );
    return result;
  }
}
