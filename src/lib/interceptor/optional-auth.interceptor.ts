import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { MemberInfoService } from 'src/service/members/member-info.service';
import { Request } from 'express';
import { AuthService } from 'src/service/members/auth.service';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(
    private readonly memberInfoService: MemberInfoService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractToken(request);
    request.user = null;
    if (!token) return true;
    const payload = await this.authService.verifyToken(token, 'authorization');
    const memberInfo = await this.memberInfoService.getMemberInfoById(
      payload.id,
    );
    if (memberInfo) request.user = memberInfo;
    return true;
  }

  private extractToken(request: Request): string | undefined {
    return request.headers.authorization;
  }
}
