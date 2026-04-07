import { Attempt } from "src/attempts/entities/attempt.entity";
import { Resource } from "src/resources/entities/resource.entity";
import { Study } from "src/studies/entities/study.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'flashcards'})
export class Flashcard {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Study, (study) => study.flashcards, { onDelete: 'CASCADE'})
    study: Study;

    @ManyToOne(() => Resource, (resource) => resource.flashcards, { onDelete: 'CASCADE'})
    resource: Resource;

    @Column({type: 'text'})
    question: string;

    @Column({type: 'text'})
    answer: string;

    // Cambiare esto por un enum o algo para controlar mejor los tipos, por ahora lo dejo como texto.
    @Column({type: "text", default: 'open'})
    type: string;

    @Column({type: 'jsonb', nullable: true})
    options: {correct: string, distractors: string[]} | null;

    @Column({type: 'text', array: true, name: 'concept_tags'})
    conceptTags: string[]

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'created_at' })
    createdAt: Date;

    @OneToMany(() => Attempt, (attempt) => attempt.flashcard)
    attempts: Attempt[];
}
