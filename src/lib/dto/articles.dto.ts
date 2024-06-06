import { IsString, MaxLength } from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @MaxLength(50)
  title: string;

  @IsString()
  content: string;

  @IsString()
  articleImg: string;
}

export class CreateArticleCommentDto {
  @IsString()
  @MaxLength(500)
  content: string;
}
