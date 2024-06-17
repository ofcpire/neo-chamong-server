import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { hashSync, genSaltSync, compareSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { MemberRepository } from 'src/members/member.repository';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private memberRepository: MemberRepository,
  ) {}
  async passwordEncrypt(password: string): Promise<string> {
    if (
      !password.match(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]/,
      )
    )
      throw new BadRequestException();
    const saltRounds = 10;
    const salt = genSaltSync(saltRounds);
    return hashSync(password, salt);
  }

  async memberLogin(email: string, password: string) {
    const memberInfo =
      await this.memberRepository.fetchMemberInfoWithPasswordByEmail(email);
    if (!memberInfo) throw new NotFoundException();
    if (compareSync(password, memberInfo.password)) {
      memberInfo.password = undefined;
      return memberInfo;
    } else return false;
  }

  async refreshTokenSign(id: string) {
    const payload = { id, type: 'refresh' };
    const token = this.jwtService.signAsync(payload, {
      secret: this.configService.get('AUTH_SECRET'),
      issuer: 'chamong',
      audience: id,
      expiresIn: '3d',
    });
    return token;
  }

  async accessTokenSign(id: string) {
    const payload = { id, type: 'authorization' };
    const token = this.jwtService.signAsync(payload, {
      secret: this.configService.get('AUTH_SECRET'),
      issuer: 'chamong',
      audience: id,
      expiresIn: '1h',
    });
    return token;
  }

  async verifyToken(token: string, type: string) {
    const result = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('AUTH_SECRET'),
      issuer: 'chamong',
    });
    if (result.type !== type) throw new Error('type mismatch');
    return result;
  }
}
