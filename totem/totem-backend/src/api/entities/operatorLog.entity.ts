import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { OpertorAction } from '../interfaces/operatorLog.interfaces';
import { Terminal } from './terminal.entity';

@Entity("operatorLog")
export class OperatorLog {
    @PrimaryGeneratedColumn('uuid')
    operatorLogId: string;

    @Column('text')
    operatorEmail: string;
   
    @Column('uuid')
    terminalId: string;      
   
    @ManyToOne(() => Terminal, (terminal) => terminal.operatorLogs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'terminalId', referencedColumnName: 'terminalId' })
    terminal: Terminal

    @Column('enum', { enum: OpertorAction })
    operatorAction: OpertorAction;

    @Column('text', { nullable: true })
    description: string;

    @Column('text', { nullable: true })
    data: string;

    @Column('timestamptz')
    stamp: Date;
   
    @Column('text', { default: 'system' })
    createdBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @Column('text', { default: 'system' })
    updatedBy: string;

    @UpdateDateColumn()
    updatedAt: Date;
}