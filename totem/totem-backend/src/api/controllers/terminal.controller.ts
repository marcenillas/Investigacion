import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query, UploadedFile, UseInterceptors } from '@nestjs/common';

import { PaginationDTO } from '../../common/dtos/pagination.data'
import { TerminalInsertDTO, TerminalUpdateDTO } from '../dtos/terminal.data';
import { TerminalService } from '../services/terminal.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

import { fileFilter, fileNamer } from '../../common/helpers/image.helper';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';

@ApiTags('Terminal')
@Controller('terminal')
export class TerminalController {

    constructor(private readonly s: TerminalService) { }

    @Post()
    create(
        @Body() dto: TerminalInsertDTO, 
    ) { 
        return this.s.create(dto);
    }

    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: TerminalUpdateDTO
    ) {
        return this.s.update(id, dto);
    }

    @Delete(':id')
    delete(@Param('id', ParseUUIDPipe) id: string) {
        return this.s.delete(id);
    }

    @Get()
    findAll(@Query() dto: PaginationDTO) {
        return this.s.findAll(dto);
    }

    @Get(':term')
    findOne(@Param('term') term: string) {
        return this.s.findOne(term);
    }

    @Get('findById/:id')
    findOneId(@Param('id') id: string) {
        return this.s.findOne(id);
    }

    @Post('findByCode')
    findByCode( @Body() dto: string[]) {
        return this.s.findByCode(dto);
    }



    @Get('checkStatus/:id')
    CheckStatus(@Param('id') id: string) {
        return this.s.checkStatus(id );
    }



    @Post('upload-carrousel')
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
                id: { // Cambia el nombre del parámetro a "miUuid"
                    type: 'string',
                    format: 'uuid', // Asegúrate de que sea un UUID válido
                },
                imageNumber: {
                    type: 'string',
                },
            },
        },
    })
    uploadCarrousel(
        @Body('id') id: string, // Recibe el primer parámetro
        @Body('imageNumber') imageNumber: string, // Recibe el segundo parámetro
        @UploadedFile() file: Express.Multer.File,

    ) {        
        this.s.uploadCarrousel(id, imageNumber , file);
    }
}