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
    logoCompanyImage?: string;

    @Column('text', { nullable: true })
    logoBranchImage?: string;

    @Column({ type: 'bytea', nullable: true })
    logoMPImageData: Buffer; 

    @Column({ type: 'bytea', nullable: true })
    logoCompanyImageData: Buffer; 

    @Column({ type: 'bytea', nullable: true })
    logoBranchImageData: Buffer; 

    @Column('text', { nullable: true })
    voucherTitle : string;

    @Column('text', { nullable: true })
    voucherLine1 : string;

    @Column('text', { nullable: true })
    voucherLine2 : string;

    @Column('text', { nullable: true })
    voucherLine3 : string;

    @Column('text', { nullable: true })
    currencySymbol: string;

    @Column('boolean', {default:0})
    feeBorneClientCharge: boolean;

    @Column('text', { nullable: true })
    branchName: string;

    @Column('text', { nullable: true })
    branchAddress: string;


    @Column('boolean',  {default:0})
    takeBranchNameConfiguration: boolean;
    
    @Column('boolean',  {default:0})
    printCancelTransaction: boolean;

    @Column('int',  {default:20})
    mpExpirateTransaction: Int32;

    @UpdateDateColumn()
    updatedAt: Date;
}