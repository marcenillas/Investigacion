import { Column, CreateDateColumn, Entity, Int32, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity("configuration")
export class Configuration {
    @PrimaryGeneratedColumn('uuid')
    configurationId: string;

    @Column('text', { nullable: true })
    mpAuthorizationToken?: string;

    @Column('text', { nullable: true })
    mpUserId: string;

    @Column('text', { nullable: true })
    mpNotificationURL?: string;

    @Column('decimal', { nullable: true })
    taxPercentage?: number

    @Column('text', { default: 'system' })
    createdBy: string;
    
    @CreateDateColumn()
    createdAt: Date;

    @Column('text', { default: 'system' })
    updatedBy: string;


    @Column('text', { nullable: true })
    logoMPImage?: string;

    @Column('text', { nullable: true })
    logoSielconImage?: string;

    @Column('text', { nullable: true })
    logoSalaImage?: string;

    @Column({ type: 'bytea', nullable: true })
    logoMPImageData: Buffer; 

    @Column({ type: 'bytea', nullable: true })
    logoSielconImageData: Buffer; 

    @Column({ type: 'bytea', nullable: true })
    logoSalaImageData: Buffer; 

    @Column('text', { nullable: true })
    TITOTitle : string;

    @Column('text', { nullable: true })
    TITOLine1 : string;

    @Column('text', { nullable: true })
    TITOLine2 : string;

    @Column('text', { nullable: true })
    TITOLine3 : string;

    @Column('text', { nullable: true })
    currencySymbol: string;

    @Column('boolean', {default:0})
    feeBorneClientCharge: boolean;

    @Column('text', { nullable: true })
    salaName: string;

    @Column('text', { nullable: true })
    salaAddress: string;


    @Column('boolean',  {default:0})
    takeSalaNameConfiguration: boolean;
    
    @Column('boolean',  {default:0})
    printCancelTransaction: boolean;

    @Column('int',  {default:20})
    mpExpirateTransaction: Int32;

    @UpdateDateColumn()
    updatedAt: Date;
}