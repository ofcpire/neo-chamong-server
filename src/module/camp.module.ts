import { Module } from '@nestjs/common';
import { MainController } from '../controller/camp/main.controller';
import { MainService } from 'src/service/camp/main.service';

@Module({
  controllers: [MainController],
  providers: [MainService],
})
export class CampModule {}
