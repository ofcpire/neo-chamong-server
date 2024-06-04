import { Request } from 'express';

export interface MemberInfoType {
  id: string;
  email: string;
  nickname: string;
  password: string;
  profileImg: string;
  about: string;
  car_name: string;
  oil_info: string;
}

export interface InterceptedRequest extends Request {
  user: MemberInfoType;
}
