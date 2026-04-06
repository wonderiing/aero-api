import { Module } from '@nestjs/common';
import { StudiesService } from './studies.service';
import { StudiesController } from './studies.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Study } from './entities/study.entity';

@Module({
  controllers: [StudiesController],
  providers: [StudiesService],
  imports: [

    TypeOrmModule.forFeature([Study])

  ],
  exports: [StudiesService]
})
export class StudiesModule {}
