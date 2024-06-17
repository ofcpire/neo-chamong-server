import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from 'src/auth/auth.service';
import { MemberRepository } from 'src/members/member.repository';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(
    private readonly memberRepository: MemberRepository,
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
        const memberInfo = await this.memberRepository.fetchMemberInfoById(
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
