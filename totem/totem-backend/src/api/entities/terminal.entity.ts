import { Column, CreateDateColumn, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { TerminalStatus } from '../interfaces/terminal.interfaces';

import { Event } from './event.entity';
import { Transaction } from './transaction.entity';
import { OperatorLog } from './operatorLog.entity';

@Entity("terminal")
export class Terminal {
    @PrimaryGeneratedColumn('uuid')
    terminalId: string;

    @Column('text', { unique: true })
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('boolean')
    enabled: boolean;

    @Column('boolean')
    modeQR: boolean;

    @Column('boolean')
    modeFixed: boolean;

    @Column('enum', { enum: TerminalStatus, default: TerminalStatus.Initializing })
    status: TerminalStatus;

    @Column('boolean',)
    printTITO: boolean;

    @Column('boolean',)
    printTicket: boolean;

    @Column('text',{ nullable: true })
    printerTicketName: string;

    @Column('text',{ nullable: true })
    printerTITOCom: string;

    @Column('text', { nullable: true })
    carrouselImage01?: string;

    @Column('text', { nullable: true })
    carrouselImage02?: string;

    @Column('text', { nullable: true })
    carrouselImage03?: string;

    @Column('text', { nullable: true })
    carrouselImage04?: string;

    @Column('text', { nullable: true })
    carrouselImage05?: string;

    @Column('text', { nullable: true })
    definedValues: string;

    @Column('text', { nullable: true })
    storeId: string;

    @Column('text', { nullable: true })
    posId: string;

    @Column('timestamp' , { nullable: true })
    lastConnection: Date;

    @Column('timestamp' , { nullable: true })
    lastTransaction: Date;

    @Column('timestamp' , { nullable: true })
    lastEvent: Date;

    @Column('text', { default: 'system' })
    createdBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column('text', { default: 'system' })
    updatedBy: string;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'bytea', nullable: true })
    carrouselImageData01: Buffer; 

    @Column({ type: 'bytea', nullable: true })
    carrouselImageData02: Buffer; 

    @Column({ type: 'bytea', nullable: true })
    carrouselImageData03: Buffer; 

    @Column({ type: 'bytea', nullable: true })
    carrouselImageData04: Buffer; 

    @Column({ type: 'bytea', nullable: true })
    carrouselImageData05: Buffer; 

    @Column('text',{ nullable: true })
    code: string;

    @Column('boolean', {default:1})
    useCashier: boolean;

    @OneToMany(() => Event, (event) => event.terminal, { cascade: true })
    @JoinColumn({
        name: 'terminalId',
        referencedColumnName: 'terminalId',
    })
    events?: Event[];

    @OneToMany(() => Transaction, (transaction) => transaction.terminal, { cascade: true })
    @JoinColumn({
        name: 'terminalId',
        referencedColumnName: 'terminalId',
    })
    transactions?: Transaction[];


    @OneToMany(() => OperatorLog, (operatorLog) => operatorLog.terminal, { cascade: true })
    @JoinColumn({
        name: 'terminalId',
        referencedColumnName: 'terminalId',
    })
    operatorLogs?: OperatorLog[];

}