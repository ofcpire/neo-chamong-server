import {
  Injectable,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Review } from './review.schema';
import { Connection, Model } from 'mongoose';
import { CreateReviewDto } from './dto/review.dto';

export class ReviewRepository {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<Review>,
    @InjectConnection() private connection: Connection,
  ) {}
  async fetchReviews(query: {
    contentId?: number;
    memberId?: string;
    reviewId?: string;
  }) {
    return await this.reviewModel.find(query).sort({ createdAt: -1 }).lean();
  }

  async fetchOneReview(query: {
    contentId?: number;
    memberId?: string;
    reviewId?: string;
  }) {
    return await this.reviewModel.findOne(query).lean();
  }

  async saveNewReview(
    CreateReviewDto: CreateReviewDto,
    contentId: number,
    memberId: string,
  ) {
    const newReview = new this.reviewModel({
      contentId,
      content: CreateReviewDto.content,
      rating: CreateReviewDto.rating,
      memberId,
    });
    return await newReview.save();
  }

  async deleteOneReview(reviewId: string) {
    return await this.reviewModel.deleteOne({ reviewId });
  }

  async patchReview(CreateReviewDto: CreateReviewDto, reviewId: string) {
    return await this.reviewModel.updateOne(
      { reviewId },
      {
        $set: {
          content: CreateReviewDto.content,
          rating: CreateReviewDto.rating,
        },
      },
    );
  }
}
