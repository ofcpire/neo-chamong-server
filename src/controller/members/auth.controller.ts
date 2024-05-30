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
  ) {}
  private readonly logger = new Logger(AuthController.name);

  @Post('/login')
  async login(@Body() body: LoginBodyType, @Response() res: Res) {
    this.logger.log(`members/login`);
    const member = await this.authService.memberLogin(
      body.email,
      body.password,
    );
    if (!member) {
      res.status(404).send('unknown email');
    } else {
      const refreshToken = await this.authService.refreshTokenSign(
        member.email,
      );
      res.setHeader('refresh', refreshToken);
      const accessToken = await this.authService.accessTokenSign(member.email);
      res.setHeader('authorization', accessToken);
      res.status(200).send(member);
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
      const memberInfo = await this.authService.getMemberInfoByEmail(
        authTokenPayload.email,
      );
      res.send(memberInfo);
    } catch (authErr) {
      try {
        const refreshTokenPayload = await this.authService.verifyToken(
          refresh,
          'refresh',
        );
        const newAccessToken = await this.authService.accessTokenSign(
          refreshTokenPayload.email,
        );
        const memberInfo = await this.authService.getMemberInfoByEmail(
          refreshTokenPayload.email,
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
    res.status(201).send(result.email);
  }

  @Get('/logout')
  async logout(@Headers('authorization') authorization, @Response() res: Res) {
    res.status(200).send();
  }
}
