import { IsArray, IsDate, IsEnum, IsOptional, IsPositive, IsString, IsUUID, Min } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { EventType } from '../interfaces/event.interfaces';

export class EventInsertDTO {
    @ApiProperty()
    @IsString()
    eventId: string;

    @ApiProperty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    data?: string;

    @ApiProperty()
    @IsDate()
    stamp: Date;

    @ApiProperty()
    @IsEnum(EventType)
    type: EventType;

    @ApiProperty()
    @IsUUID()
    terminalId: string;
}

export class EventUpdateDTO extends PartialType(EventInsertDTO) {}


export class EventFilterDTO {
    @ApiProperty()
    @IsString()
    from: string;

    @ApiProperty()
    @IsString()
    to: string;

    @ApiProperty()
    @IsArray()
    typeList: string[];

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