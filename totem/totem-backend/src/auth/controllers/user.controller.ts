import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PaginationDTO } from '../../common/dtos/pagination.data'
import { UserInsertDTO, UserUpdateDTO } from '../dtos/user.data';
import { UserService } from '../services/user.service';

@ApiTags('User')
@Controller('user')
export class UserController {

    constructor(private readonly s: UserService) { }

    @Post() create(@Body() dto: UserInsertDTO) { return this.s.create(dto); }
    
    @Patch(':id')
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @Body() dto: UserUpdateDTO
    ) {
        return this.s.update(id, dto);
    }

    @Delete(':id') delete(@Param('id', ParseUUIDPipe) id: string) { return this.s.delete(id); }

    @Get() findAll(@Query() dto: PaginationDTO) { return this.s.findAll(dto); }

    @Get(':id') findOne(@Param('id') id: string) { return this.s.findOne(id); }
}