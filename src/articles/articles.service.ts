import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  Logger,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Connection } from 'mongoose';
import { Article } from 'src/articles/article.schema';
import { CreateArticleDto } from 'src/articles/dto/articles.dto';
import { MemberService } from '../members/member.service';
import { ArticlesRepository } from './articles.repository';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class ArticlesService {
  constructor(
    private readonly memberService: MemberService,
    private readonly articlesRepository: ArticlesRepository,
    @InjectConnection() private readonly connection: Connection,
  ) {}

  async getArticlesByPageAndKeyword(
    page: number = 1,
    size: number = 15,
    keyword: string | undefined,
    memberId?: string,
  ) {
    const totalElements =
      await this.articlesRepository.fetchArticleTotalElements();
    const articleData = await this.articlesRepository.fetchArticleByPage(
      page,
      size,
      keyword,
    );
    const articleDataWithIsLiked = await this.addMemberInfoToAnything(
      await this.addIsLikeToArticles(articleData, memberId),
    );
    return {
      content: articleDataWithIsLiked,
      totalElements,
    };
  }

  async getArticleWithDetailsById(
    articleId: string,
    memberId: string | null = null,
  ) {
    const articleDocument =
      await this.articlesRepository.fetchSingleArticleByArticleId(articleId);
    articleDocument.viewCnt += 1;
    articleDocument.save();
    const articleData = articleDocument.toObject();
    const articleLikes = await this.articlesRepository.fetchArticleLikes(
      {
        articleId,
      },
      true,
    );
    const memberInfo = await this.memberService.getMemberInfoForArticleById(
      articleData.memberId,
    );
    const isLiked = memberId
      ? articleLikes.some((like) => like.memberId === memberId)
      : false;
    const articleComments = await this.getCommentsWithMemberInfo(articleId);
    return {
      ...articleData,
      ...memberInfo,
      comments: articleComments,
      commentCount: articleComments.length,
      isLiked,
    };
  }

  private async addIsLikeToArticles(
    articleArray: Article[],
    memberId?: string,
  ) {
    if (!memberId) return articleArray;
    else {
      return await Promise.all(
        articleArray.map(async (article) => {
          const query = {
            articleId: article.id,
            memberId,
          };
          const like =
            await this.articlesRepository.fetchSingleArticleLike(query);
          return {
            ...article,
            isLiked: !!like,
          };
        }),
      );
    }
  }

  private async addMemberInfoToAnything(array: any[]) {
    const memberIdList = Array.from(new Set(array.map((e) => e.memberId)));
    const memberInfos = await Promise.all(
      memberIdList.map(async (memberId) => {
        return await this.memberService.getMemberInfoForArticleById(memberId);
      }),
    );
    const arrayWithMemberInfo = array.map((e) => {
      const memberInfo = memberInfos.find(
        (memberInfo) => memberInfo.memberId === e.memberId,
      );
      return {
        ...e,
        ...memberInfo,
      };
    });
    return arrayWithMemberInfo;
  }

  private async getCommentsWithMemberInfo(articleId: string) {
    const comments =
      await this.articlesRepository.fetchArticleCommentsByArticleId(articleId);
    const commentsWithMemberInfo = await this.addMemberInfoToAnything(comments);
    return commentsWithMemberInfo;
  }

  async postArticle(CreateArticleDto: CreateArticleDto, memberId: string) {
    try {
      return await this.articlesRepository.createNewArticle(
        CreateArticleDto,
        memberId,
      );
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async patchArticle(
    createArticleDto: CreateArticleDto,
    memberId: string,
    articleId: string,
  ) {
    const existArticle =
      await this.articlesRepository.fetchSingleArticleByArticleId(articleId);
    if (existArticle.memberId !== memberId) throw new UnauthorizedException();
    return await this.articlesRepository.patchSingleArticleByDocument(
      createArticleDto,
      articleId,
    );
  }

  async getPopularArticles() {
    return await this.articlesRepository.fetchPopularArticles(3);
  }

  async deleteArticles(memberId: string, articleId: string) {
    const articleData =
      await this.articlesRepository.fetchSingleArticleByArticleId(articleId);
    if (memberId === articleData.memberId) {
      return await this.articlesRepository.unpublicSingleArticle(articleId);
    } else throw new UnauthorizedException();
  }

  async postComment(articleId: string, memberId: string, content: string) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.articlesRepository.createNewArticleComment(
        articleId,
        memberId,
        content,
      );
      await this.articlesRepository.increaseOrDecreaseArticleCommentCnt(
        articleId,
        true,
      );
      await session.commitTransaction();
      return true;
    } catch (err) {
      Logger.log(err);
      await session.abortTransaction();
      throw new InternalServerErrorException();
    } finally {
      session.endSession();
    }
  }

  async deleteComment(commentId: string, memberId: string) {
    const comment =
      await this.articlesRepository.fetchSingleArticleComments(commentId);
    if (comment.memberId !== memberId) throw new UnauthorizedException();
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.articlesRepository.unpublicSingleComment(commentId);
      await this.articlesRepository.increaseOrDecreaseArticleCommentCnt(
        comment.articleId,
        false,
      );
      await session.commitTransaction();
    } catch (err) {
      Logger.log(err);
      await session.abortTransaction();
      throw new InternalServerErrorException();
    } finally {
      session.endSession();
    }
  }

  async likeArticle(articleId: string, memberId: string) {
    if (
      this.articlesRepository.fetchArticleLikes({
        articleId,
        memberId,
      })
    )
      throw new ConflictException();
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.articlesRepository.createArticleLike(articleId, memberId);
      await this.articlesRepository.increaseOrDecreaseArticleLikeCnt(
        articleId,
        true,
      );
      await session.commitTransaction();
      return true;
    } catch (err) {
      Logger.error(err);
      await session.abortTransaction();
      throw new BadRequestException();
    } finally {
      session.endSession();
    }
  }

  async dislikeArticle(articleId: string, memberId: string) {
    const existLike = await this.articlesRepository.fetchArticleLikes({
      articleId,
      memberId,
    });
    if (!existLike) {
      throw new NotFoundException();
    }
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.articlesRepository.deleteArticleLike(articleId, memberId);
      await this.articlesRepository.increaseOrDecreaseArticleLikeCnt(
        articleId,
        false,
      );
      await session.commitTransaction();
      return true;
    } catch (err) {
      Logger.error(err);
      await session.abortTransaction();
      throw new InternalServerErrorException();
    } finally {
      session.endSession();
    }
  }

  async getArticlesByMemberId(memberId: string) {
    const articles =
      await this.articlesRepository.fetchArticlesByMemberId(memberId);
    return await this.addIsLikeToArticles(articles, memberId);
  }

  async getCommentedArticlesByMemberId(memberId: string) {
    try {
      const articleComments =
        await this.articlesRepository.fetchArticleCommentsByMemberId(memberId);
      const articleIdList = Array.from(
        new Set(articleComments.map((comment) => comment.articleId)),
      ) as string[];
      const articleData = await Promise.all(
        articleIdList.map(async (articleId) => {
          return await this.articlesRepository.fetchSingleArticleByArticleId(
            articleId,
            true,
          );
        }),
      );
      return await this.addIsLikeToArticles(
        articleData.filter((article) => !!article),
        memberId,
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  async getLikedArticlesByMemberId(memberId: string) {
    try {
      const articleIdList = (
        await this.articlesRepository.fetchArticleLikesByMemberId(memberId)
      ).map((articleLike) => articleLike.articleId);
      const articleData = await Promise.all(
        articleIdList.map(async (articleId) => {
          return await this.articlesRepository.fetchSingleArticleByArticleId(
            articleId,
            true,
          );
        }),
      );
      return await this.addIsLikeToArticles(
        articleData.filter((article) => !!article),
        memberId,
      );
    } catch (err) {
      Logger.error(err);
      throw new Error(err);
    }
  }
}
