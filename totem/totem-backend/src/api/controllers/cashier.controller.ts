import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Cashierservice } from '../services/cashier.service';
import { CahierRequest } from '../dtos/cashier.data';

@ApiTags('Cashier')
@Controller('cashier')
export class CashierController {

    constructor(private  readonly c: Cashierservice,        
    ) { }
        
    @Post('Status') Status( @Body() dto: CahierRequest, ) { return this.c.status(dto.code); }
    @Post('Generar') Generar( @Body() dto: CahierRequest, ) { return this.c.generar(dto.code , dto.montoCents); }
    /*
    @Get('getCashierGenerar/:macAddressId') getCashierStatus(@Param('macAddressId') macAddressId: string) { return this.c.status(macAddressId); }
    @Get('getCashierConsulta/:macAddressId') getCashierStatus(@Param('macAddressId') macAddressId: string) { return this.c.status(macAddressId); }
    @Get('getCashierPago/:macAddressId') getCashierStatus(@Param('macAddressId') macAddressId: string) { return this.c.status(macAddressId); }
    @Get('getCashierCancelar/:macAddressId') getCashierStatus(@Param('macAddressId') macAddressId: string) { return this.c.status(macAddressId); }
*/
}