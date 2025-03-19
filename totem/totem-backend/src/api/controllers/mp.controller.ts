import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
;
import { TransactionInsertDTO } from '../dtos/transaction.data';import { MPservice } from '../services/mp.service';
import { TransactionStatus } from '../interfaces/transactions.interfaces';
import { TerminalStateDTO } from '../dtos/terminal.data';

@ApiTags('mp')
@Controller('mp')
export class MPController {

    constructor(private readonly c: MPservice,
    ) { }

    @Post('Status') Status(@Body() dto: TerminalStateDTO,) { return this.c.status(dto); }
    @Post('GenerateOrder') GenerateOrder(@Body() dto: TransactionInsertDTO,) { return this.c.generar(dto); }


    @Post('Test') Test() {
        const dto = new TransactionInsertDTO();

        dto.transactionId = '00000000-0000-0000-0000-000000000000',
            dto.description = '00000000-0000-0000-0000-000000000000-20010000000',

            dto.amount = 100,
            dto.taxPercentage = 0,


            dto.tax = 0;
        dto.total = 100;
        dto.status = TransactionStatus.New;
        dto.stamp = new Date();
        dto.terminalId = 'd384d0c3-1b0b-4aac-bcbb-9d6e34d379f3';
        dto.copies = 1
    



       

       
       

        return this.c.generar(dto);
    }
}