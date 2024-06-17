import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { CreateReviewDto } from 'src/camp/review/dto/review.dto';
import { MemberRepository } from 'src/members/member.repository';
import { ReviewRepository } from './review.repository';
import { Connection } from 'mongoose';
import { CampRepository } from '../camp.repository';

@Injectable()
export class ReviewService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly reviewRepository: ReviewRepository,
    private readonly campRepository: CampRepository,
    @InjectConnection() private connection: Connection,
  ) {}
  async getReviewsForContentByContentId(contentId: number) {
    try {
      const reviews = await this.reviewRepository.fetchReviews({ contentId });
      const reviewsWithMemberInfo = await Promise.all(
        reviews.map(async (review) => {
          const memberInfo = await this.memberRepository.fetchMemberInfoById(
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
    if (
      await this.reviewRepository.fetchOneReview({
        contentId,
        memberId,
      })
    )
      throw new ConflictException();
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      await this.updateRatingsOfContent(contentId, CreateReviewDto.rating);
      await this.reviewRepository.saveNewReview(
        CreateReviewDto,
        contentId,
        memberId,
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

  async patchReview(
    CreateReviewDto: CreateReviewDto,
    reviewId: string,
    memberId: string,
  ) {
    const existReview = await this.reviewRepository.fetchOneReview({
      reviewId,
    });
    if (!existReview) throw new NotFoundException();
    else if (existReview.memberId !== memberId)
      throw new UnauthorizedException();

    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.reviewRepository.patchReview(CreateReviewDto, reviewId);
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
    const review = await this.reviewRepository.fetchOneReview({ reviewId });
    if (!review) throw new NotFoundException();
    else if (review.memberId !== memberId) throw new UnauthorizedException();
    const contentId = review.contentId;
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      await this.reviewRepository.deleteOneReview(reviewId);
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

  private async updateRatingsOfContent(
    contentId: number,
    newRating: number | null,
  ) {
    try {
      const existReviews = await this.reviewRepository.fetchReviews({
        contentId,
      });
      const newRatingArray = [...existReviews.map((review) => review.rating)];
      if (newRating) newRatingArray.push(newRating);
      const ratingAverage =
        newRatingArray.length > 0
          ? this.getNumberArrayAverage(newRatingArray)
          : 0;
      await this.campRepository.patchCampAverageRating(
        contentId,
        ratingAverage,
      );
    } catch (err) {
      throw new Error(err);
    }
  }

  private getNumberArrayAverage(numberArray: number[]) {
    return numberArray.reduce((a, b) => a + b) / numberArray.length;
  }

  async getReviewesByMemberId(memberId: string) {
    return await this.reviewRepository.fetchReviews({ memberId });
  }
}
