import {  IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';



export class  CahierRequest {
    
    @ApiProperty()
    @IsString()
    code: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    validationId: string;

    @ApiProperty()
    @IsString()
    @IsOptional()
    montoCents?: string;    
}
export  class CahierResponse {
    
    @ApiProperty()   
    @IsOptional()
    @IsString()
    Value ;
    
    @ApiProperty()   
    @IsOptional()
    @IsString()
    Message;

}

export  class CahierResponseTicket {
    
    @ApiProperty()   
    @IsOptional()
    @IsString()
    Code ;
    
    @ApiProperty()   
    @IsOptional()
    @IsString()
    Message;


    @ApiProperty()   
    @IsOptional()
    @IsString()
    ValidationId;

    @ApiProperty()   
    @IsOptional()
    @IsString()
    CreateDate;


    @ApiProperty()   
    @IsOptional()
    @IsString()
    ExpirateDate;


    @ApiProperty()   
    @IsOptional()
    @IsString()
    Sala;


    @ApiProperty()   
    @IsOptional()
    @IsString()
    Data1;

    
    @ApiProperty()   
    @IsOptional()
    @IsString()
    Data2;

 
}