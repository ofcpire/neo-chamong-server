import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReviewService } from 'src/camp/review/review.service';
import { ReviewController } from 'src/camp/review/review.controller';
import { Review, ReviewSchema } from './review.schema';
import { AuthModule } from 'src/auth/auth.module';
import { CampList, CampListSchema } from '../campSchema';
import { MemberInfoService } from 'src/members/member-info.service';
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
  providers: [ReviewService, MemberInfoService],
  exports: [ReviewService],
})
export class ReviewModule {}
