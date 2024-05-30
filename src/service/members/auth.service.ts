import { Injectable } from '@nestjs/common';
import { hashSync, genSaltSync, compareSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { memberModel } from 'src/lib/dbBase/model/memberModel';
import { JwtService } from '@nestjs/jwt';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}
  async passwordEncrypt(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = genSaltSync(saltRounds);
    return hashSync(password, salt);
  }

  async memberLogin(email: string, password: string) {
    const memberInfo = await memberModel.findOne({
      email: email,
    });
    if (compareSync(password, memberInfo.password)) {
      memberInfo.password = undefined;
      return memberInfo;
    } else return false;
  }

  async getMemberInfoByEmail(email: string) {
    const memberInfo = await memberModel.findOne({
      email: email,
    });
    memberInfo.password = undefined;
    return memberInfo;
  }

  async createAccount(
    nickname: string,
    email: string,
    encryptedPassword: string,
  ) {
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
}
