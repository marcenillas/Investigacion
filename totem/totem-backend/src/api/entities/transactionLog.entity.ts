import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Transaction } from './transaction.entity';
import { TransactionStep } from '../interfaces/transactions.interfaces';

@Entity("transactionLog")
export class TransactionLog {
    @PrimaryGeneratedColumn('uuid')
    transactionLogId: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('text', { nullable: true })
    data: string;

    @Column('enum', { enum: TransactionStep, default: TransactionStep.New })
    step: TransactionStep;

    @Column('timestamptz')
    stamp: Date;

    @Column('uuid')
    transactionId: string;

    @ManyToOne(() => Transaction, (transaction) => transaction.transactionLogs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'transactionId', referencedColumnName: 'transactionId' })
    transaction: Transaction

    @Column('text',{ nullable: true })
    operatorEmail: string;

    @Column('uuid',{ nullable: true })
    operatorLogId: string;

    @Column('text', { default: 'system' })
    createdBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column('text', { default: 'system' })
    updatedBy: string;

    @UpdateDateColumn()
    updatedAt: Date;
}