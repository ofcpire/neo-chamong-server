import {
  Controller,
  Get,
  Post,
  Patch,
  Logger,
  Body,
  Request,
  Response,
  Headers,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { MemberService } from 'src/members/member.service';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { JsonExtractInterceptor } from 'src/common/utils/interceptor/json-extract.interceptor';
import { ImageExtractInterceptor } from 'src/common/utils/interceptor/image-extract.interceptor';
import { InterceptedRequest } from './members';
import { PatchMemberDto } from './dto/patch-member.dto';
import { CreateMemberDto } from './dto/create-member.dto';
import { LoginMemberDto } from './dto/login-member.dto';

interface LoginBodyType {
  nickname: string;
  email: string;
  password: string;
}

@Controller('members')
export class MembersController {
  constructor(
    private readonly authService: AuthService,
    private readonly memberService: MemberService,
  ) {}
  private readonly logger = new Logger(MembersController.name);

  @Post('/login')
  async login(@Body() loginMemberDto: LoginMemberDto, @Response() res: Res) {
    this.logger.log(`members/login`);
    const memberInfo = await this.authService.memberLogin(loginMemberDto);
    if (!memberInfo) {
      res.status(404).send('unknown email');
    } else {
      const accessToken = await this.authService.accessTokenSign(memberInfo.id);
      const refreshToken = await this.authService.refreshTokenSign(
        memberInfo.id,
      );
      res.setHeader('authorization', accessToken);
      res.setHeader('refresh', refreshToken);
      res.status(200).send(memberInfo);
    }
  }

  @Get('/token')
  async tokenVerification(
    @Headers('authorization') authorization,
    @Headers('refresh') refresh,
    @Response() res: Res,
  ) {
    try {
      const authTokenPayload = await this.authService.verifyToken(
        authorization,
        'authorization',
      );
      const memberInfo = await this.memberService.getMemberInfoById(
        authTokenPayload.id,
      );
      res.send(memberInfo);
    } catch (authErr) {
      try {
        const refreshTokenPayload = await this.authService.verifyToken(
          refresh,
          'refresh',
        );
        const newAccessToken = await this.authService.accessTokenSign(
          refreshTokenPayload.id,
        );
        const memberInfo = await this.memberService.getMemberInfoById(
          refreshTokenPayload.id,
        );
        res.setHeader('authorization', newAccessToken).send(memberInfo);
      } catch (refreshErr) {
        return res.status(401).json({ message: 'Invalid or expired tokens' });
      }
    }
  }

  @Post('')
  async createAccount(
    @Body() createMemberDto: CreateMemberDto,
    @Response() res: Res,
  ) {
    const encryptedPassword = await this.authService.passwordEncrypt(
      createMemberDto.password,
    );
    const result = await this.memberService.createAccount(
      createMemberDto.nickname,
      createMemberDto.email,
      encryptedPassword,
    );
    res.status(201).send(result);
  }

  @Get('/logout')
  async logout(@Headers('authorization') authorization, @Response() res: Res) {
    res.status(200).send();
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    AnyFilesInterceptor(),
    JsonExtractInterceptor,
    ImageExtractInterceptor,
  )
  async patchMemberProfile(
    @Request() req: InterceptedRequest,
    @Body() patchMemberDto: PatchMemberDto,
  ) {
    const result = await this.memberService.patchMemberProfile(
      patchMemberDto,
      req.user?.id,
    );
    return result;
  }
}
