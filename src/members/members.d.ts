import { Request } from 'express';

export interface MemberInfoType {
  id: string;
  email: string;
  nickname: string;
  password: string;
  profileImg: string;
  about: string;
  carName: string;
  oilInfo: string;
}

export interface InterceptedRequest extends Request {
  user: MemberInfoType;
  jsonFile: any;
}
