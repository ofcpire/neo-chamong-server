import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewService } from 'src/camp/review/review.service';
import { ReviewController } from 'src/camp/review/review.controller';
import { Review, ReviewSchema } from './review.schema';
import { AuthModule } from 'src/auth/auth.module';
import { CampList, CampListSchema } from '../campSchema';
import { MemberService } from 'src/members/member.service';
import { Member, MemberSchema } from 'src/members/member.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CampList.name, schema: CampListSchema },
      { name: Review.name, schema: ReviewSchema },
      { name: Member.name, schema: MemberSchema },
    ]),
    AuthModule,
  ],
  controllers: [ReviewController],
  providers: [ReviewService, MemberService],
  exports: [ReviewService],
})
export class ReviewModule {}
