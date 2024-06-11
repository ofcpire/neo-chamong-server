import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { MemberInfoService } from 'src/members/member-info.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from 'src/members/member.schema';
import { ConfigService } from '@nestjs/config';
import { OptionalAuthGuard } from 'src/auth/optional-auth.interceptor';
import { AuthStrategy } from 'src/auth/auth.strategy';
@Module({
  imports: [
    JwtModule.register({
      signOptions: { expiresIn: '180s' },
    }),
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
  ],
  providers: [
    MemberInfoService,
    AuthService,
    ConfigService,
    JwtService,
    OptionalAuthGuard,
    AuthStrategy,
  ],
  exports: [MemberInfoService, AuthService, OptionalAuthGuard, JwtService],
})
export class AuthModule {}
