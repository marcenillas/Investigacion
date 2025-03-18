import { Controller, Post, Get, Body, Req } from '@nestjs/common';
import { MPService } from '../services/mp.service';
import {  MPDTO } from '../dtos/mp.data';
import { OrderRequiredDTO, OrderResponseDTO,  } from '../dtos/order.data';

@Controller('mp')
export class MPController {
  constructor(private readonly mpService: MPService) {}

  
  @Post('generateOrder')
  async generateOrder(@Body() data:  OrderRequiredDTO): Promise<OrderResponseDTO> {        
    return this.mpService.generateOrder(data);
  }

  @Post('status')
  async status(@Body() data: MPDTO): Promise<boolean> {
    return this.mpService.status(data);
  }

  @Post('notification')
  async handleNotification(@Body() data: any): Promise<void> {
    return this.mpService.handleNotification(data);
  }
}

