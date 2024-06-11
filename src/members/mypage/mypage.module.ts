import { Module } from '@nestjs/common';
import { MypageController } from 'src/members/mypage/mypage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MypageService } from 'src/members/mypage/mypage.service';
import { ReviewService } from 'src/camp/review/review.service';
import { Review, ReviewSchema } from 'src/camp/review/review.schema';
import { CampList, CampListSchema } from 'src/camp/campSchema';
import { AuthModule } from '../../auth/auth.module';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Review.name, schema: ReviewSchema },
      { name: CampList.name, schema: CampListSchema },
    ]),
    AuthModule,
  ],
  controllers: [MypageController],
  providers: [ReviewService, MypageService],
})
export class MypageModule {}
