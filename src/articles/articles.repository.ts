import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Article, ArticleComment, ArticleLike } from './article.schema';
import { FilterQuery } from 'mongoose';
import { CreateArticleDto } from './dto/articles.dto';

@Injectable()
export class ArticlesRepository {
  constructor(
    @InjectModel(Article.name) private articleModel: Model<Article>,
    @InjectModel(ArticleLike.name) private articleLikeModel: Model<ArticleLike>,
    @InjectModel(ArticleComment.name)
    private articleCommentModel: Model<ArticleComment>,
  ) {}

  async fetchSingleArticleByArticleId(
    articleId: string,
    isLean: boolean = false,
  ) {
    if (isLean)
      return await this.articleModel
        .findOne({ id: articleId })
        .lean({ virtuals: true });
    else
      return await this.articleModel.findOne({
        id: articleId,
      });
  }

  async fetchSingleArticleLike(
    query: FilterQuery<ArticleLike>,
    isLean: boolean = false,
  ) {
    if (isLean) return await this.articleLikeModel.findOne(query).lean();
    else return await this.articleLikeModel.findOne(query);
  }

  async fetchArticleLikes(
    query: FilterQuery<ArticleLike>,
    isLean: boolean = false,
  ) {
    if (isLean) return await this.articleLikeModel.find(query).lean();
    else return await this.articleLikeModel.find(query);
  }

  async fetchArticleByPage(
    page: number,
    size: number,
    keyword: string | undefined,
  ) {
    if (page <= 0) page = 1;
    const skip = (page - 1) * size;
    const query = keyword
      ? {
          $or: [
            { title: { $regex: keyword, $options: 'i' } },
            { content: { $regex: keyword, $options: 'i' } },
          ],
        }
      : {};
    return await this.articleModel
      .find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(size)
      .lean();
  }

  async fetchSingleArticleComments(commentId: string) {
    return await this.articleCommentModel.findOne({ id: commentId });
  }

  async fetchArticleTotalElements() {
    return await this.articleModel.countDocuments({
      public: { $ne: false },
    });
  }

  async createNewArticle(CreateArticleDto: CreateArticleDto, memberId) {
    const createdArticle = new this.articleModel({
      ...CreateArticleDto,
      imgName: CreateArticleDto.imgName,
      memberId,
    });
    await createdArticle.save();
    return createdArticle.id;
  }

  async fetchPopularArticles(limit: number) {
    return await this.articleModel.find({}).sort({ likeCnt: -1 }).limit(limit);
  }

  async patchSingleArticleByDocument(
    createArticleDto: CreateArticleDto,
    articleId: string,
  ) {
    return await this.articleModel.updateOne(
      {
        articleId,
      },
      {
        $set: { ...createArticleDto },
      },
    );
  }

  async increaseArticleViewCnt(articleId: string) {
    return await this.articleModel.updateOne(
      { id: articleId },
      { $inc: { viewCnt: 1 } },
    );
  }

  async increaseOrDecreaseArticleCommentCnt(
    articleId: string,
    isIncrease: boolean,
  ) {
    const commentCnt = isIncrease ? 1 : -1;
    return await this.articleModel.updateOne(
      { id: articleId },
      { $inc: { commentCnt } },
    );
  }

  async increaseOrDecreaseArticleLikeCnt(
    articleId: string,
    isIncrease: boolean,
  ) {
    const likeCnt = isIncrease ? 1 : -1;
    return await this.articleModel.updateOne(
      { id: articleId },
      { $inc: { likeCnt } },
    );
  }

  async deleteArticleLike(articleId: string, memberId: string) {
    return await this.articleLikeModel.deleteOne({
      articleId,
      memberId,
    });
  }

  async createArticleLike(articleId: string, memberId: string) {
    const newLikeArticle = new this.articleLikeModel({
      articleId,
      memberId,
    });
    return await newLikeArticle.save();
  }

  async fetchArticlesByMemberId(memberId: string) {
    return await this.articleModel
      .find({ memberId })
      .sort({ createdAt: -1 })
      .lean();
  }

  async fetchArticleLikesByMemberId(memberId: string) {
    return await this.articleLikeModel
      .find({ memberId })
      .sort({ createdAt: -1 })
      .lean();
  }

  async fetchArticleCommentsByMemberId(memberId: string) {
    return await this.articleCommentModel
      .find({ memberId })
      .sort({ createdAt: -1 })
      .lean();
  }

  async fetchArticleCommentsByArticleId(articleId: string) {
    return await this.articleCommentModel
      .find({
        articleId,
      })
      .sort({ createdAt: 1 })
      .lean();
  }

  async createNewArticleComment(
    articleId: string,
    memberId: string,
    content: string,
  ) {
    const newArticleComment = new this.articleCommentModel({
      articleId,
      memberId,
      content,
    });
    return await newArticleComment.save();
  }

  async unpublicSingleArticle(articleId: string) {
    return await this.articleModel.updateOne(
      { articleId },
      {
        $set: { public: false },
      },
    );
  }
  async unpublicSingleComment(commentId: string) {
    return await this.articleModel.updateOne(
      { commentId },
      {
        $set: { public: false },
      },
    );
  }
}
