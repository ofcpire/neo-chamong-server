import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
  Logger,
  ConflictException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Article,
  ArticleComment,
  ArticleLike,
} from 'src/articles/article.schema';
import { CreateArticleDto } from 'src/articles/dto/articles.dto';
import { MemberInfoService } from '../members/member-info.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    @InjectModel(ArticleLike.name) private articleLikeModel: Model<ArticleLike>,
    @InjectModel(ArticleComment.name)
    private articleCommentModel: Model<ArticleComment>,
    private memberInfoService: MemberInfoService,
  ) {}
  async getArticlesByPage(
    page: number = 1,
    size: number = 15,
    memberId?: string,
  ) {
    const skip = (page - 1) * size;
    const totalElements = await this.articleModel.countDocuments({
      public: { $ne: false },
    });
    const articleData = await this.articleModel
      .find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size)
      .lean();
    const articleDataWithIsLiked = await this.addMemberInfoToAnything(
      await this.addIsLikeToArticles(articleData, memberId),
    );
    return {
      content: articleDataWithIsLiked,
      totalElements,
    };
  }

  private async getArticleById(articleId: string, lean: boolean = false) {
    if (lean) return await this.articleModel.findOne({ id: articleId }).lean();
    else
      return await this.articleModel.findOne({
        id: articleId,
      });
  }

  async getArticleWithDetailsById(
    articleId: string,
    memberId: string | null = null,
  ) {
    const articleDocument = await this.getArticleById(articleId);
    articleDocument.viewCnt += 1;
    articleDocument.save();
    const articleData = articleDocument.toObject();
    const articleLikes = await this.articleLikeModel.find({ articleId }).lean();
    const memberInfo =
      await this.memberInfoService.getMemberInfoForArticleById(memberId);
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
          const like = await this.articleLikeModel.findOne({
            articleId: article.id,
            memberId,
          });
          return {
            ...article,
            isLiked: !!like,
          };
        }),
      );
    }
  }

  private async getCommentsByArticleId(articleId: string) {
    const comments = await this.articleCommentModel
      .find({
        articleId,
      })
      .sort({ createdAt: 1 })
      .lean();
    return comments;
  }

  private async addMemberInfoToAnything(array: any[]) {
    const memberIdList = Array.from(new Set(array.map((e) => e.memberId)));
    const memberInfos = await Promise.all(
      memberIdList.map(async (memberId) => {
        return await this.memberInfoService.getMemberInfoForArticleById(
          memberId,
        );
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
    const comments = await this.getCommentsByArticleId(articleId);
    const commentsWithMemberInfo = await this.addMemberInfoToAnything(comments);
    return commentsWithMemberInfo;
  }

  async postArticle(CreateArticleDto: CreateArticleDto, memberId: string) {
    try {
      const createdArticle = new this.articleModel({
        ...CreateArticleDto,
        memberId,
      });
      await createdArticle.save();
      return createdArticle.id;
    } catch (err) {
      throw new BadRequestException();
    }
  }

  async patchArticle(
    CreateArticleDto: CreateArticleDto,
    memberId: string,
    articleId: string,
  ) {
    const existArticle = await this.getArticleById(articleId);
    if (existArticle.memberId !== memberId) throw new UnauthorizedException();
    existArticle.title = CreateArticleDto.title;
    existArticle.content = CreateArticleDto.content;
    await existArticle.save();
    return true;
  }

  async getPopularArticles() {
    return await this.articleModel.find({}).sort({ likeCnt: -1 }).limit(3);
  }

  async deleteArticles(memberId: string, articleId: string) {
    const articleData = await this.getArticleById(articleId);
    if (memberId === articleData.memberId) {
      articleData.public = false;
      await articleData.save();
    }
  }

  async postComment(articleId: string, memberId: string, content: string) {
    const session = await this.articleCommentModel.db.startSession();
    session.startTransaction();
    const newArticleComment = new this.articleCommentModel({
      articleId,
      memberId,
      content,
    });
    try {
      await this.articleModel.updateOne(
        { id: articleId },
        { $inc: { commentCnt: 1 } },
      );
      await newArticleComment.save();
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

  async deleteComment(commentId: number, memberId: string) {
    const comment = await this.articleCommentModel.findOne({ id: commentId });
    if (comment.memberId === memberId) {
      comment.public = false;
    } else throw new UnauthorizedException();
    const session = await this.articleCommentModel.startSession();
    session.startTransaction();
    try {
      await comment.save();
      await this.articleModel.updateOne(
        { id: comment.articleId },
        { $inc: { commentCnt: -1 } },
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
      await this.articleLikeModel.findOne({
        articleId,
        memberId,
      })
    )
      throw new ConflictException();
    const session = await this.articleLikeModel.db.startSession();
    session.startTransaction();
    try {
      const newLikeArticle = new this.articleLikeModel({
        articleId,
        memberId,
      });
      newLikeArticle.save();
      await this.articleModel.updateOne(
        { id: articleId },
        { $inc: { likeCnt: 1 } },
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
    const existLike = await this.articleLikeModel.findOne({
      articleId,
      memberId,
    });
    if (!existLike) {
      throw new NotFoundException();
    }
    const session = await this.articleLikeModel.db.startSession();
    session.startTransaction();
    try {
      await this.articleLikeModel.deleteOne({
        articleId,
        memberId,
      });
      await this.articleModel.updateOne(
        { id: articleId },
        { $inc: { likeCnt: -1 } },
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
    const articles = await this.articleModel
      .find({ memberId })
      .sort({ createdAt: -1 })
      .lean();
    return await this.addIsLikeToArticles(articles, memberId);
  }

  async getCommentedArticlesByMemberId(memberId: string) {
    try {
      const articleComments = await this.articleCommentModel
        .find({ memberId })
        .sort({ createdAt: -1 })
        .lean();
      const articleIdList = Array.from(
        new Set(articleComments.map((comment) => comment.articleId)),
      ) as string[];
      const articleData = await Promise.all(
        articleIdList.map(async (articleId) => {
          return await this.getArticleById(articleId, true);
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
        await this.articleLikeModel
          .find({ memberId })
          .sort({ createdAt: -1 })
          .lean()
      ).map((articleLike) => articleLike.articleId);
      const articleData = await Promise.all(
        articleIdList.map(async (articleId) => {
          return await this.getArticleById(articleId, true);
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
