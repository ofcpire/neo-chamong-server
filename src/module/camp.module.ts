import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MainController } from '../controller/camp/main.controller';
import { MainService } from 'src/service/camp/main.service';
import {
  CampList,
  CampKeyword,
  CampListSchema,
  CampKeywordSchema,
} from 'src/lib/dbBase/schema/campSchema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: CampList.name, schema: CampListSchema },
      { name: CampKeyword.name, schema: CampKeywordSchema },
    ]),
  ],
  controllers: [MainController],
  providers: [MainService],
})
export class CampModule {}
