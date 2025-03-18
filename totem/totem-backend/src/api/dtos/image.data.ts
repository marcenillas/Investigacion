import { IsNumber, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class ImageInsertDTO {
    @ApiProperty()
    @IsString()
    name: string;

    @ApiProperty()
    @IsString()
    path: string;

    @ApiProperty()
    @IsNumber()
    terminalId: number;
}

export class ImageUpdateDTO extends PartialType(ImageInsertDTO) {}