import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class ConfigurationInsertDTO {
    @ApiProperty()
    @IsString()
    configurationId: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    mpAuthorizationToken?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    mpUserId?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    mpNotificationURL?: string;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    taxPercentage?: number

    @ApiProperty()
    @IsString()
    @IsOptional()
    TITOTitle? : string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    TITOLine1? : string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    TITOLine2? : string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    TITOLine3? : string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    logoMPImage?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    logoSielconImage?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    logoSalaImage?: string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    logoMPImageDataS?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    logoSielconImageDataS?: string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    logoSalaImageDataS?: string;    

    @ApiProperty()
    @IsString()
    @IsOptional()
    currencySymbol?: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    feeBorneClientCharge? : boolean

    @ApiProperty()
    @IsString()
    @IsOptional()
    salaName?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    salaAddress?: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    takeSalaNameConfiguration?: boolean;
    
    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    printCancelTransaction?: boolean;

    @ApiProperty()
    @IsNumber()
    @IsOptional()
    mpExpirateTransaction?: number;

}

export class ConfigurationUpdateDTO extends PartialType(ConfigurationInsertDTO) {}