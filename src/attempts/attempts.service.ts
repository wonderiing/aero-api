import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attempt } from './entities/attempt.entity';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { FlashcardService } from 'src/flashcard/flashcard.service';

@Injectable()
export class AttemptsService {

    private readonly logger = new Logger(AttemptsService.name);

    constructor(
        @InjectRepository(Attempt)
        private readonly attemptRepo: Repository<Attempt>,
        private readonly flashcardService: FlashcardService,
    ) {}

    async create(createAttemptDto: CreateAttemptDto, flashcardId: string, userId: string): Promise<Attempt> {

        const flashcard = await this.flashcardService.findOne(flashcardId, userId);

        const attempt = this.attemptRepo.create({
            ...createAttemptDto,
            flashcard,
            study: flashcard.study,
            user: { id: userId },
        });

        return this.attemptRepo.save(attempt);
    }

    async findAllByStudy(studyId: string, userId: string) {

        const attempts = await this.attemptRepo.find({
            where: { study: { id: studyId }, user: { id: userId } },
            relations: ['flashcard'],
            order: { answeredAt: 'DESC' },
        });

        const total = attempts.length;
        const correct = attempts.filter(a => a.isCorrect).length;
        const accuracy = total > 0 ? Math.round((correct / total) * 100) / 100 : 0;

        return {
            total,
            correct,
            accuracy,
            attempts,
        };
    }
}
