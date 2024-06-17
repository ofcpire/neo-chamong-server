import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/auth/auth.service';
import { MemberService } from 'src/members/member.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from 'src/members/member.schema';
import { ConfigService } from '@nestjs/config';
import { OptionalAuthGuard } from 'src/auth/optional-auth.interceptor';
import { AuthStrategy } from 'src/auth/auth.strategy';
import { MemberRepository } from 'src/members/member.repository';
@Module({
  imports: [
    JwtModule.register({
      signOptions: { expiresIn: '180s' },
    }),
    MongooseModule.forFeature([{ name: Member.name, schema: MemberSchema }]),
  ],
  providers: [
    AuthService,
    ConfigService,
    JwtService,
    OptionalAuthGuard,
    AuthStrategy,
    MemberRepository,
  ],
  exports: [AuthService, OptionalAuthGuard, JwtService, ConfigService],
})
export class AuthModule {}
