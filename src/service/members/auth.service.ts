import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { hashSync, genSaltSync, compareSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { memberModel } from 'src/lib/dbBase/model/memberModel';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async passwordEncrypt(password: string): Promise<string> {
    if (
      !password.match(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]/,
      )
    )
      throw new BadRequestException();
    const saltRounds = 10;
    const salt = genSaltSync(saltRounds);
    return hashSync(password, salt);
  }

  async memberLogin(email: string, password: string) {
    const memberInfo = await memberModel.findOne({
      email: email,
    });
    console.log(memberInfo);
    if (compareSync(password, memberInfo.password)) {
      memberInfo.password = undefined;
      return memberInfo;
    } else return false;
  }

  async createAccount(
    nickname: string,
    email: string,
    encryptedPassword: string,
  ) {
    if (!nickname || !email || !this.emailValidator(email)) {
      throw new BadRequestException();
    }
    const isMemberExist = await memberModel.findOne({
      email,
    });
    if (!isMemberExist) {
      const memberObj = {
        email,
        nickname,
        password: encryptedPassword,
        profileImg: null,
        about: '자기소개를 입력해주세요.',
        car_name: '',
        oil_info: null,
      };

      const memberClass = new memberModel(memberObj);
      memberClass
        .save()
        .then(() => {
          console.log(memberClass);
        })
        .catch((err) => {
          console.log('Error : ' + err);
        });
      return memberObj;
    } else throw new ConflictException();
  }

  async refreshTokenSign(email: string) {
    const payload = { email, type: 'refresh' };
    const token = this.jwtService.signAsync(payload, {
      secret: this.configService.get('AUTH_SECRET'),
      issuer: 'chamong',
      audience: email,
      expiresIn: '3d',
    });
    return token;
  }

  async accessTokenSign(email: string) {
    const payload = { email, type: 'authorization' };
    const token = this.jwtService.signAsync(payload, {
      secret: this.configService.get('AUTH_SECRET'),
      issuer: 'chamong',
      audience: email,
      expiresIn: '15m',
    });
    return token;
  }

  async verifyToken(token: string, type: string) {
    const result = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get('AUTH_SECRET'),
      issuer: 'chamong',
    });
    if (result.type !== type) throw new Error('type mismatch');
    return result;
  }

  async emailValidator(email: string) {
    const emailRegex = new RegExp(
      "/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:.[a-zA-Z0-9-]+)*$/",
    );
    return emailRegex.test(email);
  }
}
