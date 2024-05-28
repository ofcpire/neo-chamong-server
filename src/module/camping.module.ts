import { Module } from '@nestjs/common';
import { MainController } from '../controller/camping/main.controller';

@Module({
  controllers: [MainController],
})
export class CampingModule {}
