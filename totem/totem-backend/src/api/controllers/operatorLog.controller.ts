import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PaginationDTO } from '../../common/dtos/pagination.data'
import { ApiTags } from '@nestjs/swagger';
import { OperatorLogService } from '../services/operatorLog.service';
import { OperatorLogFilterDTO, OperatorLogInsertDTO, OperatorLogUpdateDTO } from '../dtos/operatorLog.data';

@ApiTags('OperatorLog')
@Controller('operatorLog')
export class OperatorLogController {

    constructor(private readonly s: OperatorLogService) { }

    @Post() create(@Body() dto: OperatorLogInsertDTO) { return this.s.create(dto); }

    @Patch(':id') update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: OperatorLogUpdateDTO) { return this.s.update(id, dto); }
  
    @Delete(':id') delete(@Param('id', ParseUUIDPipe) id: string) { return this.s.delete(id); }

    @Get() findAll(@Query() dto: PaginationDTO) { return this.s.findAll(dto); }

    @Get(':term') findOne(@Param('term') term: string) { return this.s.findOne(term); }


    @Post('OperatorLogByFilter') 
    operatorLogByFilter(@Body() dto: OperatorLogFilterDTO ) { return this.s.findByFilter(dto); }
 
}