import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttemptsService } from './attempts.service';
import { AttemptsController } from './attempts.controller';
import { Attempt } from './entities/attempt.entity';
import { FlashcardModule } from 'src/flashcard/flashcard.module';

@Module({
    controllers: [AttemptsController],
    providers: [AttemptsService],
    imports: [
        TypeOrmModule.forFeature([Attempt]),
        FlashcardModule,
    ],
    exports: [AttemptsService],
})
export class AttemptsModule {}
