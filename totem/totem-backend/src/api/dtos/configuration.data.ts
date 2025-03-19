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
    voucherTitle? : string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    voucherLine1? : string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    VoucherLine2? : string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    VoucherLine3? : string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    logoMPImage?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    logoCompanyImage?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    logoBranchImage?: string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    logoMPImageDataS?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    logoCompanyImageDataS?: string;


    @ApiProperty()
    @IsString()
    @IsOptional()
    logoBranchImageDataS?: string;    

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
    branchName?: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    branchAddress?: string;

    @ApiProperty()
    @IsBoolean()
    @IsOptional()
    takeBranchNameConfiguration?: boolean;
    
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