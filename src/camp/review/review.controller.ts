import {
  Controller,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Logger,
  UseGuards,
  Request,
  Response,
  BadRequestException,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ReviewService } from 'src/camp/review/review.service';
import { InterceptedRequest } from 'src/members/members';
import { Response as Res } from 'express';
import { CreateReviewDto } from './dto/review.dto';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  private readonly logger = new Logger(ReviewController.name);

  @Post('/:contentId')
  @UseGuards(JwtAuthGuard)
  async postReview(
    @Param('contentId') contentId: number,
    @Body() body: CreateReviewDto,
    @Request() req: InterceptedRequest,
    @Response() res: Res,
  ) {
    this.logger.log(`Post /review/${contentId}`);
    try {
      await this.reviewService.postReview(body, contentId, req.user.id);
      res.status(201).send();
    } catch (err) {
      this.logger.error(err);
      throw new BadRequestException();
    }
  }

  @Patch('/:reviewId')
  @UseGuards(JwtAuthGuard)
  async patchReview(
    @Param('reviewId') reviewId: string,
    @Body() body: CreateReviewDto,
    @Request() req: InterceptedRequest,
  ) {
    this.logger.log(`Patch /review/${reviewId}`);
    return await this.reviewService.patchReview(body, reviewId, req.user.id);
  }

  @Delete('/:reviewId')
  @UseGuards(JwtAuthGuard)
  async deleteReview(
    @Param('reviewId') reviewId: string,
    @Request() req: InterceptedRequest,
    @Response() res: Res,
  ) {
    this.logger.log(`Delete /review/${reviewId}`);
    const result = await this.reviewService.deleteReview(reviewId, req.user.id);
    if (result) res.status(204).send('deleted');
    else res.status(500);
  }
}
