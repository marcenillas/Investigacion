
import { BeforeInsert, BeforeUpdate, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../interfaces/user.interfaces';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    userId: string;

    @Column('text', {
        unique: true
    })
    email: string;

    @Column('text', {
        select: false
    })
    password: string;

    @Column('text')
    fullName: string;

    @Column('boolean')
    enabled: boolean;

    @Column('enum', { 
        enum: UserRole,
        array: true
    })
    roles: number[];

    @Column('text', { default: 'system' })
    createdBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column('text', { default: 'system' })
    updatedBy: string;

    @UpdateDateColumn()
    updatedAt: Date;

    @BeforeInsert()
    checkFieldsBeforeInsert() {
        this.email = this.email.toLowerCase().trim();
    }

    @BeforeUpdate()
    checkFieldsBeforeUpdate() {
        this.checkFieldsBeforeInsert();   
    }
}