import { Flashcard } from "src/flashcard/entities/flashcard.entity";
import { Study } from "src/studies/entities/study.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'resources'})
export class Resource {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'text'})
    title: string;

    @Column({type: 'text'})
    content: string;

    @Column({type: 'text', nullable: true, name: 'source_name'})
    sourceName: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "created_at" })
    createdAt: Date;

    @ManyToOne(() => Study, (study) => study.resources, { onDelete: 'CASCADE'})
    study: Study

    @OneToMany(() => Flashcard, (flashcard) => flashcard.resource)
    flashcards: Flashcard[];
}
