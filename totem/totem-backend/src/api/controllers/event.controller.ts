import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';

import { PaginationDTO } from '../../common/dtos/pagination.data'
import { EventFilterDTO, EventInsertDTO, EventUpdateDTO } from '../dtos/event.data';
import { EventService } from '../services/event.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Event')
@Controller('event')
export class EventController {

    constructor(private readonly s: EventService) { }

    @Post()
    create(@Body() dto: EventInsertDTO) {
        return this.s.create(dto);
    }

    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: EventUpdateDTO
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

    @Post('EventByFilter') 
    eventByFilter(@Body() dto: EventFilterDTO ) { return this.s.findByFilter(dto); }
}