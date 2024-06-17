import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @MaxLength(50)
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  imgName: string | null;
}

export class CreateArticleCommentDto {
  @IsString()
  @MaxLength(500)
  content: string;
}
