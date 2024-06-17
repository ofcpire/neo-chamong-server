import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewService } from 'src/camp/review/review.service';
import { ReviewController } from 'src/camp/review/review.controller';
import { Review, ReviewSchema } from './review.schema';
import { AuthModule } from 'src/auth/auth.module';
import {
  CampKeyword,
  CampKeywordSchema,
  CampList,
  CampListSchema,
} from '../campSchema';
import { Member, MemberSchema } from 'src/members/member.schema';
import { ReviewRepository } from './review.repository';
import { MembersModule } from 'src/members/members.module';
import { CampRepository } from '../camp.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CampList.name, schema: CampListSchema },
      { name: CampKeyword.name, schema: CampKeywordSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Member.name, schema: MemberSchema },
    ]),
    AuthModule,
    MembersModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService, ReviewRepository, CampRepository],
  exports: [
    ReviewService,
    ReviewRepository,
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
  ],
})
export class ReviewModule {}
