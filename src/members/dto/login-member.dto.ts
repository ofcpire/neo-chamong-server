import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginMemberDto {
  @IsString()
  @IsEmail(
    {},
    {
      message: '이메일이 아닙니다.',
    },
  )
  email: string;

  @IsString()
  @MinLength(8, {
    message: '비밀번호는 8자 이상이어야 합니다.',
  })
  password: string;
}
