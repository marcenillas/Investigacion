import { IsArray, IsDate, IsEnum, IsOptional, IsPositive, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { OpertorAction } from '../interfaces/operatorLog.interfaces';


export class OperatorLogInsertDTO {
    @ApiProperty()
    @IsString()
    operatorLogId: string;

    @ApiProperty()
    @IsString()
    operatorEmail: string;

    @ApiProperty()
    @IsUUID()
    terminalId

    @ApiProperty()
    @IsString()
    data: string;

    @ApiProperty()
    @IsEnum(OpertorAction)
    operatorAction: OpertorAction;

    @ApiProperty()
    @IsString()
    description: string;


    @ApiProperty()
    @IsDate()
    stamp: Date;


}

export class OperatorLogUpdateDTO extends PartialType(OperatorLogInsertDTO) { }


export class OperatorLogFilterDTO {
    @ApiProperty()
    @IsString()
    from: string;

    @ApiProperty()
    @IsString()
    to: string;

    @ApiProperty()
    @IsArray()
    operatorList:  string[];

    @ApiProperty()
    @IsArray()
    operatorActionList: number[];

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
