import { IsArray, IsDate, IsEnum, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Min } from 'class-validator';
import { TransactionStatus } from '../interfaces/transactions.interfaces';
import { ApiProperty } from '@nestjs/swagger';
import { PaginationDTO } from 'src/common/dtos/pagination.data';

export class TransactionInsertDTO {
    @ApiProperty()
    @IsString()
    transactionId: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNumber()
    amount?: number;

    @ApiProperty()
    @IsNumber()
    taxPercentage?: number;

    @ApiProperty()
    @IsNumber()
    tax?: number;

    @ApiProperty()
    @IsNumber()
    total?: number;

    @ApiProperty()
    @IsEnum(TransactionStatus)
    status: TransactionStatus;

    @ApiProperty()
    @IsDate()
    stamp: Date;

    @ApiProperty()
    @IsUUID()
    terminalId: string;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    copies?: number;
}

export class TransactionUpdateDTO {
    @ApiProperty()
    @IsString()
    orderRequestData: string;

    @ApiProperty()
    @IsString()
    orderResponseData: string;

    @ApiProperty()
    @IsString()
    cashierData: string;

    @ApiProperty()
    @IsEnum(TransactionStatus)
    status: TransactionStatus;

    @ApiProperty()
    @IsOptional()
    @IsNumber()
    copies?: number;

    @ApiProperty()
    @IsString()
    updatedBy: string;
}

export class TransactionFilterDTO {
    @ApiProperty()
    @IsString()
    from: string;

    @ApiProperty()
    @IsString()
    to: string;

    @ApiProperty()
    @IsArray()
    statusList: string[];

    @ApiProperty()
    @IsArray()
    terminalList: string[];

    @ApiProperty()
    @IsOptional()
    @IsPositive()
    limit?: number;
    
    @ApiProperty()
    @IsOptional()
    @Min(0)
    offset?: number;
}

export class TransactionFilterTerminalDTO {
    
    @ApiProperty()
    @IsUUID()
    terminalId: string;  
}