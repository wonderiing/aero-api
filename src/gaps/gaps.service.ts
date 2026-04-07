import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attempt } from 'src/attempts/entities/attempt.entity';
import { StudiesService } from 'src/studies/studies.service';

@Injectable()
export class GapsService {

    constructor(
        @InjectRepository(Attempt)
        private readonly attemptRepo: Repository<Attempt>,
        private readonly studiesService: StudiesService,
    ) {}

    async getGaps(studyId: string, userId: string) {

        // Validar que el study existe y pertenece al usuario
        await this.studiesService.findOne(studyId, userId);

        // 1. Traer todos los attempts del study con su flashcard
        const attempts = await this.attemptRepo.find({
            where: { study: { id: studyId }, user: { id: userId } },
            relations: ['flashcard'],
            order: { answeredAt: 'ASC' },
        });

        // 2. Agrupar attempts por concept_tag
        const conceptMap = new Map<string, Attempt[]>();

        for (const attempt of attempts) {
            const tags = attempt.flashcard?.conceptTags ?? [];
            for (const tag of tags) {
                if (!conceptMap.has(tag)) conceptMap.set(tag, []);
                conceptMap.get(tag)!.push(attempt);
            }
        }

        // 3. Calcular métricas por concepto
        const gaps: GapEntry[] = [];
        const strongConcepts: StrongEntry[] = [];

        for (const [concept, records] of conceptMap.entries()) {
            if (records.length < 3) continue;

            const errors = records.filter(r => !r.isCorrect).length;
            const errorRate = errors / records.length;

            // Calcular trend
            const recent = records.slice(-3);
            const older = records.slice(0, -3);
            const recentRate = recent.filter(r => !r.isCorrect).length / recent.length;
            const olderRate = older.length
                ? older.filter(r => !r.isCorrect).length / older.length
                : null;

            const trend: string =
                olderRate === null             ? 'sin_datos'  :
                recentRate > olderRate + 0.1   ? 'empeorando' :
                recentRate < olderRate - 0.1   ? 'mejorando'  : 'estable';

            // Tipo de error dominante
            const errorTypes = records
                .filter(r => r.errorType)
                .map(r => r.errorType!);
            const dominantErrorType = this.mode(errorTypes);

            const entry = {
                concept,
                error_rate: Math.round(errorRate * 100) / 100,
                total_attempts: records.length,
                errors,
                dominant_error_type: dominantErrorType,
                trend,
                last_seen: records[records.length - 1].answeredAt,
            };

            if (errorRate >= 0.3) {
                gaps.push(entry);
            } else {
                strongConcepts.push({
                    concept,
                    error_rate: entry.error_rate,
                    total_attempts: entry.total_attempts,
                });
            }
        }

        gaps.sort((a, b) => b.error_rate - a.error_rate);

        return {
            study_id: studyId,
            total_attempts: attempts.length,
            gaps,
            strong_concepts: strongConcepts,
        };
    }

    /** Devuelve el valor más frecuente de un array, o null si está vacío */
    private mode(values: string[]): string | null {
        if (!values.length) return null;

        const freq = new Map<string, number>();
        for (const v of values) {
            freq.set(v, (freq.get(v) ?? 0) + 1);
        }

        let maxCount = 0;
        let result: string | null = null;

        for (const [value, count] of freq.entries()) {
            if (count > maxCount) {
                maxCount = count;
                result = value;
            }
        }

        return result;
    }
}

export interface GapEntry {
    concept: string;
    error_rate: number;
    total_attempts: number;
    errors: number;
    dominant_error_type: string | null;
    trend: string;
    last_seen: Date;
}

export interface StrongEntry {
    concept: string;
    error_rate: number;
    total_attempts: number;
}
