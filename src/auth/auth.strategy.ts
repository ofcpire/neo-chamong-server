import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { MemberService } from 'src/members/member.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly memberService: MemberService,
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

  async validate(payload: { id: string }) {
    const member = await this.memberService.getMemberInfoById(payload.id);
    if (!member) {
      throw new UnauthorizedException();
    }
    return member;
  }
}
