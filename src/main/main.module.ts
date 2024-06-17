import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MainController } from './main.controller';
import { MainService } from 'src/main/main.service';
import {
  CampList,
  CampKeyword,
  CampListSchema,
  CampKeywordSchema,
} from 'src/camp/campSchema';
import { AuthModule } from 'src/auth/auth.module';
import { BookmarkModule } from '../camp/bookmark/bookmark.module';
import { ReviewModule } from '../camp/review/review.module';
import { CampService } from '../camp/camp.service';
import { MembersModule } from 'src/members/members.module';
import { CampModule } from '../camp/camp.module';
import { CampRepository } from '../camp/camp.repository';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CampList.name, schema: CampListSchema },
      { name: CampKeyword.name, schema: CampKeywordSchema },
    ]),
    AuthModule,
    BookmarkModule,
    ReviewModule,
    MembersModule,
    CampModule,
  ],
  controllers: [MainController],
  providers: [MainService, CampService, CampRepository],
  exports: [MainService],
})
export class MainModule {}
