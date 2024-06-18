import { IsString, IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateMemberDto {
  @IsString()
  @MaxLength(20, {
    message: '닉네임이 너무 깁니다.',
  })
  nickname: string;

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
