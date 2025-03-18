import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { TransactionStep } from '../interfaces/transactions.interfaces';
import { ApiProperty, PartialType } from '@nestjs/swagger';


export class TransactionLogInsertDTO {
    @ApiProperty()
    @IsString()
    transactionLogId: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsString()
    data: string;

    @ApiProperty()
    @IsEnum(TransactionStep)
    step: TransactionStep;

    @ApiProperty()
    @IsDate()
    stamp: Date;

    @ApiProperty()
    @IsUUID()
    transactionId: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    operatorEmail: string;

    @ApiProperty()
    @IsUUID()
    @IsOptional()
    operatorLogId: string;

}

export class TransactionLogUpdateDTO extends PartialType(TransactionLogInsertDTO) { }