import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from 'src/controller/auth/members.controller';
import { AuthService } from 'src/service/auth/auth.service';

@Module({
  imports: [
    JwtModule.register({
      signOptions: { expiresIn: '180s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
