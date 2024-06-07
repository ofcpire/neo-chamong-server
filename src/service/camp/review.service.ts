import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Review } from 'src/lib/dbBase/schema/reviewSchema';
import { CreateReviewDto } from 'src/lib/dto/review.dto';
import { Model } from 'mongoose';
import { MemberInfoService } from '../members/member-info.service';
import { CampList } from 'src/lib/dbBase/schema/campSchema';

@Injectable()
export class ReviewService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly memberInfoService: MemberInfoService,
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectModel(CampList.name) private campListModel: Model<CampList>,
  ) {}
  async getReviewsForContentByContentId(contentId: number) {
    try {
      const reviews = await this.reviewModel.find({ contentId }).lean();
      const reviewsWithMemberInfo = await Promise.all(
        reviews.map(async (review) => {
          const memberInfo = await this.memberInfoService.getMemberInfoById(
            review.memberId,
          );
          return {
            ...review,
            member: memberInfo,
          };
        }),
      );
      return reviewsWithMemberInfo;
    } catch (err) {
      throw new NotFoundException();
    }
  }

  async postReview(
    CreateReviewDto: CreateReviewDto,
    contentId: number,
    memberId: string,
  ) {
    if (await this.reviewModel.findOne({ contentId, memberId }))
      throw new ConflictException();
    const newReview = new this.reviewModel({
      contentId,
      content: CreateReviewDto.content,
      rating: CreateReviewDto.rating,
      memberId,
    });
    const session = await this.reviewModel.db.startSession();
    try {
      session.startTransaction();
      await this.updateRatingsOfContent(contentId, CreateReviewDto.rating);
      await newReview.save();
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

  async patchReview(
    CreateReviewDto: CreateReviewDto,
    reviewId: string,
    memberId: string,
  ) {
    const existReview = await this.reviewModel.findOne({ reviewId }).lean();
    if (!existReview) throw new NotFoundException();
    else if (existReview.memberId !== memberId)
      throw new UnauthorizedException();

    const session = await this.reviewModel.db.startSession();
    session.startTransaction();
    try {
      await this.reviewModel.updateOne(
        { reviewId },
        {
          $set: {
            content: CreateReviewDto.content,
            rating: CreateReviewDto.rating,
          },
        },
      );
      await this.updateRatingsOfContent(existReview.contentId, null);
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

  async deleteReview(reviewId: string, memberId: string) {
    const review = await this.reviewModel.findOne({ reviewId }).lean();
    if (!review) throw new NotFoundException();
    else if (review.memberId !== memberId) throw new UnauthorizedException();
    const contentId = review.contentId;
    const session = await this.reviewModel.db.startSession();
    session.startTransaction();
    try {
      await this.reviewModel.deleteOne({ reviewId, memberId });
      await this.updateRatingsOfContent(contentId, null);
      await session.commitTransaction();
      return true;
    } catch (err) {
      await session.abortTransaction();
      throw new InternalServerErrorException(err);
    } finally {
      session.endSession();
    }
  }

  private getNumberArrayAverage(numberArray: number[]) {
    return numberArray.reduce((a, b) => a + b) / numberArray.length;
  }

  private async updateRatingsOfContent(
    contentId: number,
    newRating: number | null,
  ) {
    try {
      const existReviews = await this.reviewModel.find({ contentId }).lean();
      const newRatingArray = [...existReviews.map((review) => review.rating)];
      if (newRating) newRatingArray.push(newRating);
      const ratingAverage =
        newRatingArray.length > 0
          ? this.getNumberArrayAverage(newRatingArray)
          : 0;
      await this.campListModel.updateOne(
        { contentId },
        { $set: { totalRating: ratingAverage } },
      );
    } catch (err) {
      throw new Error(err);
    }
  }
}
