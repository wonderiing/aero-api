import { Module } from '@nestjs/common';
import { FlashcardService } from './flashcard.service';
import { FlashcardController } from './flashcard.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Flashcard } from './entities/flashcard.entity';

@Module({
  controllers: [FlashcardController],
  providers: [FlashcardService],
  imports: [

    TypeOrmModule.forFeature([Flashcard])

  ]
})
export class FlashcardModule {}
