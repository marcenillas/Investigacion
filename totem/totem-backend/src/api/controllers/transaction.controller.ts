import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { PaginationDTO } from '../../common/dtos/pagination.data'
import { TransactionFilterDTO, TransactionFilterTerminalDTO, TransactionInsertDTO, TransactionUpdateDTO } from '../dtos/transaction.data';
import { TransactionService } from '../services/transaction.service';
import { ApiTags } from '@nestjs/swagger';
import { CashService } from '../services/cash.service';

@ApiTags('Transaction')
@Controller('transaction')
export class TransactionController {

    constructor(private readonly s: TransactionService,
        private  readonly c: CashService,
    ) { }

    @Post() create(@Body() dto: TransactionInsertDTO) { return this.s.create(dto); }

    @Patch(':id') update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: TransactionUpdateDTO) { return this.s.update(id, dto); }

    @Patch('updateData/:id') updateData(@Param('id', ParseUUIDPipe) id: string , @Body() dto: TransactionUpdateDTO) { return this.s.updateData(id ,dto); }
    
    @Delete(':id') delete(@Param('id', ParseUUIDPipe) id: string) { return this.s.delete(id); }

    @Get() findAll(@Query() dto: PaginationDTO) { return this.s.findAll(dto); }

    @Get(':term') findOne(@Param('term') term: string) { return this.s.findOne(term); }

    @Post('ReceiveNotifications')   
    receiveNotifications(@Body() body: any): string { this.s.process(body); return "0";}    

    @Post('TransactionByFilter') 
    transactionByFilter(@Body() dto: TransactionFilterDTO ) { return this.s.findByFilter(dto); }

    @Post('TransactionByTerminal') 
    TransactionByTerminal(@Body() dto: TransactionFilterTerminalDTO ) { return this.s.findByTerminal(dto); }
        
}