import { Module } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { FlashcardController } from './flashcard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flashcard } from './entities/flashcard.entity';
import { StudiesModule } from 'src/studies/studies.module';
import { Resource } from 'src/resources/entities/resource.entity';
import { ResourcesModule } from 'src/resources/resources.module';

@Module({
  controllers: [FlashcardController],
  providers: [FlashcardService],
  imports: [

    TypeOrmModule.forFeature([Flashcard]),
    StudiesModule,
    ResourcesModule

  ],
  exports: [FlashcardService],
})
export class FlashcardModule {}
