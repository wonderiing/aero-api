import { Exclude, Expose } from "class-transformer";
import { User } from "src/auth/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'studies' })
export class Study {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    title: string;

    @Column({type: 'text'})
    description: string;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "created_at" })
    createdAt: Date;

    @ManyToOne( () => User, (user) => user.studies,{ onDelete: 'CASCADE'})
    user: User;

}
