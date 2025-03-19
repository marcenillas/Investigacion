import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CashService } from '../services/cash.service';
import { CashRequest } from '../dtos/cash.data';

@ApiTags('Cash')
@Controller('cash')
export class CashController {

    constructor(private  readonly c: CashService,        
    ) { }
        
    @Post('Status') Status( @Body() dto: CashRequest, ) { return this.c.status(dto.code); }
    @Post('Generar') Generar( @Body() dto: CashRequest, ) { return this.c.generar(dto.code , dto.montoCents); }
   
}