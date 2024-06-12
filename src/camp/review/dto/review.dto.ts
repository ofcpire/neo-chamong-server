import { IsNumber, IsString, MaxLength, IsIn } from 'class-validator';

export class CreateReviewDto {
  @IsString()
  @MaxLength(300)
  content: string;

  @IsNumber()
  @IsIn([1, 2, 3, 4, 5])
  rating: number;
}
