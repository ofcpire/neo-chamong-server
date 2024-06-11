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
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ArticlesService } from 'src/articles/articles.service';
import { WrapContentInterceptor } from 'src/common/utils/interceptor/wrap-content.interceptor';
import { InterceptedRequest } from 'src/members/members';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { CreateArticleCommentDto } from 'src/articles/dto/articles.dto';
import { OptionalAuthGuard } from 'src/auth/optional-auth.interceptor';
import { FormdataService } from 'src/common/utils/services/formdata.service';

@Controller('articles')
export class ArticlesController {
  constructor(
    private readonly articlesService: ArticlesService,
    private readonly formdataService: FormdataService,
  ) {}
  private readonly logger = new Logger(ArticlesController.name);

  @Get()
  @UseGuards(OptionalAuthGuard)
  @UseInterceptors(WrapContentInterceptor)
  async getArticles(
    @Query('page') page: number = 1,
    @Query('row') row: number = 10,
    @Request() req: InterceptedRequest,
  ) {
    this.logger.log(`Get /articles?page=${page}&row=${row}`);
    return await this.articlesService.getArticlesByPage(
      page,
      row,
      req.user?.id,
    );
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
    @Param('articleId') articleId: string,
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
      await this.formdataService.extractFormDataBodyByKey(
        req.files,
        'articleCreate',
      ),
      req.user.id,
    );
    res.status(201).send({ id });
  }

  @Patch('/:articleId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(AnyFilesInterceptor())
  async patchArticles(
    @Param('articleId') articleId: string,
    @Request() req: InterceptedRequest,
    @Response() res: Res,
  ) {
    await this.articlesService.patchArticle(
      await this.formdataService.extractFormDataBodyByKey(
        req.files,
        'articleUpdate',
      ),
      req.user.id,
      articleId,
    );
    res.status(200).send();
  }

  @Delete('/:articleId')
  @UseGuards(JwtAuthGuard)
  async deleteArticles(
    @Param('articleId') articleId: string,
    @Request() req: InterceptedRequest,
    @Response() res: Res,
  ) {
    await this.articlesService.deleteArticles(req.user?.id, articleId);
    res.status(204).send(`delete /articles/${articleId}`);
  }

  @Post('/:articleId/like')
  @UseGuards(JwtAuthGuard)
  async likeArticles(
    @Param('articleId') articleId: string,
    @Request() req: InterceptedRequest,
    @Response() res: Res,
  ) {
    await this.articlesService.likeArticle(articleId, req.user.id);
    res.status(201).send();
  }

  @Delete('/:articleId/like')
  @UseGuards(JwtAuthGuard)
  async dislikeArticles(
    @Param('articleId') articleId: string,
    @Request() req: InterceptedRequest,
    @Response() res: Res,
  ) {
    await this.articlesService.dislikeArticle(articleId, req.user.id);
    res.status(204).send();
  }

  @Post('/:articleId/comments')
  @UseGuards(JwtAuthGuard)
  async postArticleComment(
    @Param('articleId') articleId: string,
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
