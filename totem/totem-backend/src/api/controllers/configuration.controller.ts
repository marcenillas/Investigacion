import { Controller, Get, Body, Patch, ParseUUIDPipe, Param, Post, UseInterceptors, UploadedFile } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ConfigurationUpdateDTO } from '../dtos/configuration.data';
import { ConfigurationService } from '../services/configuration.service';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('Configuration')
@Controller('configuration')
export class ConfigurationController {

    constructor(private readonly s: ConfigurationService) { }

    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: ConfigurationUpdateDTO
    ) {
        return this.s.update(id, dto);
    }

    @Get() findAll() { return this.s.findAll(); }
   
    @Post('upload-logo')    
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },             
                option: {
                    type: 'string',
                },
            },
        },
    })
    uploadLogo(      
        @Body('option') option: string, // Recibe el segundo parámetro
        @UploadedFile() file: Express.Multer.File,

    ) {        
        this.s.uploadLogo(  option , file )
    }
}