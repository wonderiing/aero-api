import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attempt } from './entities/attempt.entity';
import { CreateAttemptDto } from './dto/create-attempt.dto';
import { FlashcardService } from 'src/flashcard/flashcard.service';
import { Flashcard } from 'src/flashcard/entities/flashcard.entity';

@Injectable()
export class AttemptsService {

    private readonly logger = new Logger(AttemptsService.name);

    constructor(
        @InjectRepository(Attempt)
        private readonly attemptRepo: Repository<Attempt>,
        @InjectRepository(Flashcard)
        private readonly flashcardRepo: Repository<Flashcard>,
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

        const savedAttempt = await this.attemptRepo.save(attempt);

        await this.updateSpacedRepetition(flashcard, createAttemptDto.isCorrect);

        return savedAttempt;
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

    /**
     * SM-2 Algorithm
     * 
     * Si respondió correctamente:
     *   - repetición 1: interval = 1 día
     *   - repetición 2: interval = 6 días
     *   - repetición n: interval = interval_anterior * easeFactor
     *   - easeFactor se ajusta según confidenceScore (calidad 0-5 en SM-2)
     * 
     * Si respondió incorrectamente:
     *   - interval vuelve a 1 día
     *   - easeFactor baja (mínimo 1.3)
     */
    private async updateSpacedRepetition(flashcard: Flashcard, isCorrect: boolean): Promise<void> {

        let { easeFactor, intervalDays } = flashcard;

        if (isCorrect) {
            // Progresión SM-2
            if (intervalDays === 0) {
                intervalDays = 1;
            } else if (intervalDays === 1) {
                intervalDays = 6;
            } else {
                intervalDays = Math.round(intervalDays * easeFactor);
            }

            // Ajustar ease factor (subir ligeramente al acertar)
            easeFactor = Math.max(1.3, easeFactor + 0.1);
        } else {
            // Reset al fallar
            intervalDays = 1;
            easeFactor = Math.max(1.3, easeFactor - 0.2);
        }

        const nextReviewAt = new Date();
        nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays);

        await this.flashcardRepo.update(flashcard.id, {
            easeFactor,
            intervalDays,
            nextReviewAt,
        });
    }
}
