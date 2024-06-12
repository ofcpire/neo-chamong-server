import { IsString, IsIn, MaxLength, IsOptional } from 'class-validator';

export class PatchMemberDto {
  @IsString()
  @MaxLength(20, {
    message: '닉네임이 너무 깁니다.',
  })
  nickname: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsString()
  @MaxLength(500, {
    message: '자기 소개가 너무 깁니다.',
  })
  about: string;

  @IsString()
  @MaxLength(20, {
    message: '차량 이름이 너무 깁니다.',
  })
  carName: string;

  @IsIn(['휘발유', '경유', '전기', '수소', 'LPG'], {
    message: '잘못된 분류입니다.',
  })
  oilInfo: string;
}
