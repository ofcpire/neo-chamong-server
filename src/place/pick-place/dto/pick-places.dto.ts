import { IsArray, IsString, IsNumber } from 'class-validator';

export class CreatePickPlaceDto {
  @IsString()
  memo: string;

  @IsArray()
  keywords: string[];

  @IsNumber()
  mapX: number;
  @IsNumber()
  mapY: number;

  @IsString()
  address: string;
}
