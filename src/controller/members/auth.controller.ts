import {
  Controller,
  Get,
  Post,
  Logger,
  Body,
  Response,
  Headers,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/service/members/auth.service';
import { MemberInfoService } from 'src/service/members/member-info.service';

interface LoginBodyType {
  nickname: string;
  email: string;
  password: string;
}

@Controller('members')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly memberInfoService: MemberInfoService,
  ) {}
  private readonly logger = new Logger(AuthController.name);

  @Post('/login')
  async login(@Body() body: LoginBodyType, @Response() res: Res) {
    this.logger.log(`members/login`);
    const memberInfo = await this.authService.memberLogin(
      body.email,
      body.password,
    );
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
      const memberInfo = await this.memberInfoService.getMemberInfoById(
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
        const memberInfo = await this.memberInfoService.getMemberInfoById(
          refreshTokenPayload.id,
        );
        res.setHeader('authorization', newAccessToken).send(memberInfo);
      } catch (refreshErr) {
        return res.status(401).json({ message: 'Invalid or expired tokens' });
      }
    }
  }

  @Post('')
  async createAccount(@Body() body: LoginBodyType, @Response() res: Res) {
    const encryptedPassword = await this.authService.passwordEncrypt(
      body.password,
    );
    const result = await this.authService.createAccount(
      body.nickname,
      body.email,
      encryptedPassword,
    );
    res.status(201).send(result);
  }

  @Get('/logout')
  async logout(@Headers('authorization') authorization, @Response() res: Res) {
    res.status(200).send();
  }
}
