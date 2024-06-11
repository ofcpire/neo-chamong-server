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
  async getArticlesByPage(page: number = 1, row: number = 10) {
    const skip = (page - 1) * row;
    const articleData = await this.articleModel
      .find({
        public: { $ne: false },
      })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(row);
    return articleData.reverse();
  }

  private async getArticleById(articleId: string) {
    const articleData = await this.articleModel.findOne({ id: articleId });
    return articleData;
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
      likeCnt: articleLikes.length,
      comments: articleComments,
      commentCount: articleComments.length,
      isLiked,
    };
  }

  private async getCommentsByArticleId(articleId: string) {
    const comments = await this.articleCommentModel
      .find({
        articleId,
        public: {
          $ne: false,
        },
      })
      .sort({ createdAt: 1 })
      .lean();
    return comments;
  }

  private async getCommentsWithMemberInfo(articleId: string) {
    const comments = await this.getCommentsByArticleId(articleId);
    const memberIdList = Array.from(new Set(comments.map((e) => e.memberId)));
    const memberInfos = await Promise.all(
      memberIdList.map(async (memberId) => {
        return await this.memberInfoService.getMemberInfoForArticleById(
          memberId,
        );
      }),
    );
    const commentsWithMemberInfo = comments.map((comment) => {
      const memberInfo = memberInfos.find(
        (memberInfo) => memberInfo.memberId === comment.memberId,
      );
      return {
        ...comment,
        ...memberInfo,
      };
    });
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

  async extractArticleBody(
    files:
      | {
          [fieldname: string]: Express.Multer.File[];
        }
      | Express.Multer.File[],
    key: string,
  ) {
    if (!Array.isArray(files)) throw new BadRequestException();
    const articleString = files.find((e) => e.fieldname === key).buffer;
    if (articleString) {
      const articleBody = JSON.parse(articleString as unknown as string);
      return articleBody;
    } else {
      throw new BadRequestException();
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
}
