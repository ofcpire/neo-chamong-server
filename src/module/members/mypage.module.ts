import { Module } from '@nestjs/common';
import { MypageController } from 'src/controller/members/mypage.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { MypageService } from 'src/service/members/mypage.service';
import { ReviewService } from 'src/service/camp/review.service';
import { Review, ReviewSchema } from 'src/lib/dbBase/schema/reviewSchema';
import { CampList, CampListSchema } from 'src/lib/dbBase/schema/campSchema';
import { AuthModule } from '../auth.module';
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
