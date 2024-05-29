import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controller/members/auth.controller';
import { AuthService } from 'src/service/members/auth.service';
import { MypageController } from 'src/controller/members/mypage.controller';
import { AuthStrategy } from 'src/lib/interceptor/auth.strategy';

@Module({
  imports: [
    JwtModule.register({
      signOptions: { expiresIn: '180s' },
    }),
  ],
  controllers: [AuthController, MypageController],
  providers: [AuthService, AuthStrategy],
})
export class MembersModule {}
