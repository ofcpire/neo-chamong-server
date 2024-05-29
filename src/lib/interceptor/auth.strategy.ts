import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from 'src/service/members/auth.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: (req) => {
        let token = ExtractJwt.fromHeader('authorization')(req);
        if (!token && req.headers.refresh) {
          token = ExtractJwt.fromHeader('refresh')(req);
        }
        return token;
      },
      secretOrKey: configService.get('AUTH_SECRET'),
    });
  }

  async validate(payload: { email: string }) {
    const member = await this.authService.getMemberInfoByEmail(payload.email);
    if (!member) {
      throw new UnauthorizedException();
    }
    return member;
  }
}
