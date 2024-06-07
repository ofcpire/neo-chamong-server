import { IsNumber, IsString, MaxLength } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @MaxLength(200)
  content: string;

  @IsNumber()
  rating: number;
}
