import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PaginationDTO } from '../../common/dtos/pagination.data'
import { TransactionLogInsertDTO, TransactionLogUpdateDTO } from '../dtos/transactionLog.data';
import { ApiTags } from '@nestjs/swagger';
import { TransactionLogService } from '../services/transactionLog.service';

@ApiTags('TransactionLog')
@Controller('transactionLog')
export class TransactionLogController {

    constructor(private readonly s: TransactionLogService) { }

    @Post() create(@Body() dto: TransactionLogInsertDTO) { return this.s.create(dto); }

    @Patch(':id') update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: TransactionLogUpdateDTO) { return this.s.update(id, dto); }
  
    @Delete(':id') delete(@Param('id', ParseUUIDPipe) id: string) { return this.s.delete(id); }

    @Get() findAll(@Query() dto: PaginationDTO) { return this.s.findAll(dto); }

    @Get(':term') findOne(@Param('term') term: string) { return this.s.findOne(term); }

    @Get('/transaction/:id') findByTransacction(@Param('id') id: string) { return this.s.findByTransaction(id); }
 
}