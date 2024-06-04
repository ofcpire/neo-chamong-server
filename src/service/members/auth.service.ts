import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { hashSync, genSaltSync, compareSync } from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Member } from 'src/lib/dbBase/schema/memberSchema';
import { Model } from 'mongoose';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(Member.name) private memberModel: Model<Member>,
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
    const memberInfo = await this.memberModel.findOne({
      email: email,
    });
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
    const isMemberExist = await this.memberModel.findOne({
      email,
    });
    if (!isMemberExist) {
      const memberClass = new this.memberModel({
        id: uuid(),
        email,
        nickname,
        password: encryptedPassword,
        profileImg: null,
        about: '자기소개를 입력해주세요.',
        car_name: '',
        oil_info: null,
      });
      memberClass.save().catch((err) => {
        Logger.log('Error : ' + err);
      });
      return memberClass.email;
    } else throw new ConflictException();
  }

  async refreshTokenSign(id: string) {
    const payload = { id, type: 'refresh' };
    const token = this.jwtService.signAsync(payload, {
      secret: this.configService.get('AUTH_SECRET'),
      issuer: 'chamong',
      audience: id,
      expiresIn: '3d',
    });
    return token;
  }

  async accessTokenSign(id: string) {
    const payload = { id, type: 'authorization' };
    const token = this.jwtService.signAsync(payload, {
      secret: this.configService.get('AUTH_SECRET'),
      issuer: 'chamong',
      audience: id,
      expiresIn: '1h',
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
