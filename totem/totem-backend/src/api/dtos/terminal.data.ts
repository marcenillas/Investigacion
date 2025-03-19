import { IsBoolean, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { TerminalStatus } from '../interfaces/terminal.interfaces';

export class TerminalInsertDTO {
    @ApiProperty()
    @IsString()
    terminalId: string;

    @ApiProperty()
    @IsString()
    name: string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsBoolean()
    enabled: boolean;

    @ApiProperty()
    @IsBoolean()
    modeQR: boolean;

    @ApiProperty()
    @IsBoolean()
    modeFixed: boolean;

    @ApiProperty()
    @IsEnum(TerminalStatus)
    status: TerminalStatus;

    @ApiProperty()
    @IsString()
    @IsOptional()
    carrouselImage01?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    carrouselImage02?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    carrouselImage03?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    carrouselImage04?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    carrouselImage05?: string;

    @ApiProperty()
    @IsString()
    definedValues: string;

    @ApiProperty()
    @IsString()
    storeId: string;

    @ApiProperty()
    @IsString()
    posId: string;

    @ApiProperty()
    @IsBoolean()
    printVoucher: boolean;

    @ApiProperty()
    @IsBoolean()
    printTicket: boolean;

    @ApiProperty()
    @IsString()
    @IsOptional()
    printerTicketName?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    printerVoucherCom?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    carrouselImageData01S?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    carrouselImageData02S?: string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    carrouselImageData03S?: string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    carrouselImageData04S?: string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    carrouselImageData05S?: string;

    @ApiProperty()
    @IsString()  
    @IsOptional()  
    code?: string;


    @ApiProperty()
    @IsBoolean()  
    @IsOptional()  
    useCash?: boolean;


}

export class TerminalUpdateDTO extends PartialType(TerminalInsertDTO) { }


export class TerminalStateDTO{
    @ApiProperty()
    @IsString()
    terminalId: string;

    @ApiProperty()
    @IsBoolean()
    enabled: boolean;
}