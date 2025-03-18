import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { EventType } from '../interfaces/event.interfaces';
import { Terminal } from './terminal.entity';

@Entity("event")
export class Event {
    @PrimaryGeneratedColumn('uuid')
    eventId: string;

    @Column('text')
    code: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('text', { nullable: true })
    data: string;

    @Column('timestamptz')
    stamp: Date;

    @Column('enum', { enum: EventType, default: EventType.Info })
    type: EventType;

    @Column('uuid')
    terminalId: string;

    @ManyToOne(() => Terminal, (terminal) => terminal.events, {  onDelete: 'CASCADE' })
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
}