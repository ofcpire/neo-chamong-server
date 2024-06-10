import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthService } from 'src/service/members/auth.service';
import { MemberInfoService } from 'src/service/members/member-info.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Member, MemberSchema } from 'src/lib/dbBase/schema/memberSchema';
import { ConfigService } from '@nestjs/config';
import { OptionalAuthGuard } from 'src/lib/interceptor/optional-auth.interceptor';
import { AuthStrategy } from 'src/lib/interceptor/auth.strategy';
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
