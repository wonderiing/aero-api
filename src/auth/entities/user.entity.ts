import { Study } from "src/studies/entities/study.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'users'})
export class User { 

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'text'})
    username: string;

    @Column({type: 'text', unique: true})
    email: string;

    @Column({type: 'text', name: 'password_hash'})
    passwordHash: string;

    @Column({type: 'boolean', default: false, name: 'is_active'})
    isActive: boolean;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "created_at" })
    createdAt: Date;

    @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP", name: "updated_at" })
    updatedAt: Date;

    @Column({type: 'text', nullable: true, name: 'otp_code'})
    otpCode: string | null;

    @Column({type: 'timestamp', nullable: true, name: 'otp_expiration'})
    otpExpiration: Date | null;

    @Column({nullable: true, type: 'text'})
    hashedRefreshToken: string | null;

    @OneToMany(() => Study, (study) => study.user)
    studies: Study[];
}