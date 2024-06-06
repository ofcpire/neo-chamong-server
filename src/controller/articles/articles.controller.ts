import {
  Controller,
  Get,
  Post,
  Query,
  Param,
  Logger,
  UseGuards,
  Patch,
  Response,
  Request,
  UseInterceptors,
  Delete,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { Response as Res } from 'express';
import { JwtAuthGuard } from 'src/lib/interceptor/auth.guard';
import { ArticlesService } from 'src/service/articles/articles.service';
import { WrapContentInterceptor } from 'src/lib/interceptor/wrap-content.interceptor';
import { InterceptedRequest } from 'src/types/members';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateArticleCommentDto } from 'src/lib/dto/articles.dto';
import { OptionalAuthGuard } from 'src/lib/interceptor/optional-auth.interceptor';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}
  private readonly logger = new Logger(ArticlesController.name);

  @Get()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(WrapContentInterceptor)
  async getArticles(
    @Query('page') page: number = 1,
    @Query('row') row: number = 10,
  ) {
    return await this.articlesService.getArticlesByPage(page, row);
  }

  @Get('/popular-app')
  async getPopularApp() {
    return this.articlesService.getPopularArticles();
  }

  @Get('/popular-web')
  async getPopularWeb() {
    return this.articlesService.getPopularArticles();
  }

  @Get('/:articleId')
  @UseGuards(OptionalAuthGuard)
  async getArticleByArticleId(
    @Param('articleId') articleId: number,
    @Request() req: InterceptedRequest,
  ) {
    const memberInfo = req.user ? req.user.id : null;
    const articleData = await this.articlesService.getArticleWithDetailsById(
      articleId,
      memberInfo,
    );
    return articleData;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async postArticles(@Request() req: InterceptedRequest, @Response() res: Res) {
    const id = await this.articlesService.postArticle(
      await this.articlesService.extractArticleBody(req.files, 'articleCreate'),
      req.user.id,
    );
    res.status(201).send({ id });
  }

  @Patch('/:articlesId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async patchArticles(
    @Param('articlesId') articlesId: number,
    @Request() req: InterceptedRequest,
    @Response() res: Res,
  ) {
    await this.articlesService.patchArticle(
      await this.articlesService.extractArticleBody(req.files, 'articleUpdate'),
      req.user.id,
      articlesId,
    );
    res.status(200).send();
  }

  @Delete('/:articlesId')
  @UseGuards(JwtAuthGuard)
  async deleteArticles(
    @Param('articlesId') articlesId: number,
    @Request() req: InterceptedRequest,
    @Response() res: Res,
  ) {
    await this.articlesService.deleteArticles(req.user?.id, articlesId);
    res.status(204).send(`delete /articles/${articlesId}`);
  }

  @Post('/:articleId/like')
  @UseGuards(JwtAuthGuard)
  async likeArticles(
    @Param('articleId') articleId: number,
    @Request() req: InterceptedRequest,
    @Response() res: Res,
  ) {
    await this.articlesService.likeArticle(articleId, req.user.id);
    res.status(201).send();
  }

  @Delete('/:articleId/like')
  @UseGuards(JwtAuthGuard)
  async dislikeArticles(
    @Param('articleId') articleId: number,
    @Request() req: InterceptedRequest,
    @Response() res: Res,
  ) {
    await this.articlesService.dislikeArticle(articleId, req.user.id);
    res.status(204).send();
  }

  @Post('/:articleId/comments')
  @UseGuards(JwtAuthGuard)
  async postArticleComment(
    @Param('articleId') articleId: number,
    @Request() req: InterceptedRequest,
    @Response() res: Res,
    @Body() body: CreateArticleCommentDto,
  ) {
    this.logger.log(`Post /${articleId}/comments`);
    try {
      await this.articlesService.postComment(
        articleId,
        req.user.id,
        body.content,
      );
      res.status(201).send();
    } catch (err) {
      this.logger.log(err);
      throw new BadRequestException();
    }
  }

  @Delete('/:articleId/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  async deleteArticleComment(
    @Param('commentId') commentId: number,
    @Request() req: InterceptedRequest,
    @Response() res: Res,
  ) {
    const memberId = req.user.id;
    await this.articlesService.deleteComment(commentId, memberId);
    res.status(204).send();
  }

  @Patch('/:articleId/comments/:commentId')
  @UseGuards(JwtAuthGuard)
  async patchArticleComment(@Response() res: Res) {
    //해당 기능은 API 명세서엔 존재하지만 프론트엔드에서 구현되지 않았음
    res.status(500).send();
  }
}
