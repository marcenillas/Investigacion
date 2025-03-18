import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { Terminal } from './terminal.entity';
import { TransactionStatus } from '../interfaces/transactions.interfaces';
import { TransactionLog } from './transactionLog.entity';

@Entity("transaction")
export class Transaction {
    @PrimaryGeneratedColumn('uuid')
    transactionId: string;

    @Column('text', { nullable: true })
    description: string;
        
    @Column('text', { nullable: true })
    paymentMethod: string;
    
    @Column('decimal', { nullable: true })
    amount: number;

    @Column('decimal', { nullable: true })
    taxPercentage: number ;
    
    @Column('decimal', { nullable: true })
    tax: number ;

    @Column('boolean', {default:0})
    feeBorneClientCharge: boolean;
    
    @Column('decimal', { nullable: true })
    mpFee: number ;

    @Column('decimal', { nullable: true })
    mpTax: number ;

    @Column('decimal', { nullable: true })
    total: number ;

    @Column('decimal', { nullable: true })
    mptotal: number ;

    @Column('decimal', { nullable: true })
    mpCode: number ;
    
    @Column('text', { nullable: true })
    orderRequestData: string;

    @Column('text', { nullable: true })
    orderResponseData: string;

    @Column('text', { nullable: true })
    merchantOrderData: string;

    @Column('text', { nullable: true })
    paymentData: string;

    @Column('text', { nullable: true })
    cashierData: string;

    @Column('int', { nullable: true })
    copies: number;

    @Column('timestamptz')
    stamp: Date;

    @Column('enum', { enum: TransactionStatus, default: TransactionStatus.New })
    status: TransactionStatus;

    @Column('uuid')
    terminalId: string;

    @ManyToOne(() => Terminal, (terminal) => terminal.transactions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'terminalId', referencedColumnName: 'terminalId' })
    terminal: Terminal

    @Column('text', { default: 'system' })
    createdBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column('text', { default: 'system' })
    updatedBy: string;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => TransactionLog, (transactionLog) => transactionLog.transaction, { cascade: true })
    @JoinColumn({
        name: 'transactionId',
        referencedColumnName: 'transactionId',
    })
    transactionLogs?: TransactionLog[];
}