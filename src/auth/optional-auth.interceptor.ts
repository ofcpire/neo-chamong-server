import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { MemberService } from 'src/members/member.service';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(
    private readonly memberService: MemberService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    request.user = null;
    if (token) {
      try {
        const payload = await this.authService.verifyToken(
          token,
          'authorization',
        );
        const memberInfo = await this.memberService.getMemberInfoById(
          payload.id,
        );
        if (memberInfo) request.user = memberInfo;
      } catch (err) {
        Logger.log('Token expired');
      }
    }
    return true;
  }

  private extractToken(request: Request): string | undefined {
    return request.headers.authorization;
  }
}
