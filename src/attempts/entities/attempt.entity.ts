import { Flashcard } from 'src/flashcard/entities/flashcard.entity';
import { Study } from 'src/studies/entities/study.entity';
import { User } from 'src/auth/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'attempts' })
export class Attempt {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Flashcard, (flashcard) => flashcard.attempts, { onDelete: 'CASCADE' })
    flashcard: Flashcard;

    @ManyToOne(() => Study, (study) => study.attempts, { onDelete: 'CASCADE' })
    study: Study;

    @ManyToOne(() => User, (user) => user.attempts, { onDelete: 'CASCADE' })
    user: User;

    @Column({ type: 'text', nullable: true, name: 'user_answer' })
    userAnswer: string | null;

    @Column({ type: 'boolean', name: 'is_correct' })
    isCorrect: boolean;

    @Column({ type: 'varchar', length: 50, nullable: true, name: 'error_type' })
    errorType: string | null;

    @Column({ type: 'text', array: true, nullable: true, name: 'missing_concepts' })
    missingConcepts: string[] | null;

    @Column({ type: 'text', array: true, nullable: true, name: 'incorrect_concepts' })
    incorrectConcepts: string[] | null;

    @Column({ type: 'text', nullable: true })
    feedback: string | null;

    @Column({ type: 'float', nullable: true, name: 'confidence_score' })
    confidenceScore: number | null;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'answered_at' })
    answeredAt: Date;
}
