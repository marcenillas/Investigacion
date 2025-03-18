import { Controller, Get, Post, Body, UseGuards, Headers, Patch } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';

import { IncomingHttpHeaders } from 'http';

import { GetUser, Auth, RoleProtected } from '../strategy/auth.decorators';
import { UserRoleGuard } from '../strategy/user-role.guard';

import { AuthService } from '../services/auth.service';

import { UserAccountDTO, UserInsertDTO, UserLoginDTO } from '../dtos/user.data';
import { User } from '../entities/user.entity';
import { UserRole } from '../interfaces/user.interfaces';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly s: AuthService) { }

    @Post('register') register(@Body() d: UserInsertDTO) { return this.s.register(d); }

    @Post('login') login(@Body() d: UserLoginDTO) { return this.s.login(d); }

    @Get('check-status') @Auth() checkStatus( @GetUser() user: User) { return this.s.checkStatus(user); }

    @Patch('account') account(@Body() dto: UserAccountDTO) { return this.s.account(dto); }

    @Get('privateRoute')
    @UseGuards(AuthGuard())
    testingPrivateRoute(
        @GetUser() user: User,
        @Headers() headers: IncomingHttpHeaders,
    ) {
        return {
            message: 'Testing private route',
            user,
            headers
        }
    }

    @Get('privateUserOrAdmin')
    @RoleProtected(UserRole.User, UserRole.Admin)
    @UseGuards(AuthGuard(), UserRoleGuard)
    testingPrivateUserOrAdmin(
        @GetUser() user: User,
        @Headers() headers: IncomingHttpHeaders,
    ) {
        return {
            message: 'Testing private route for User or Admin',
            user,
            headers
        }
    }
}