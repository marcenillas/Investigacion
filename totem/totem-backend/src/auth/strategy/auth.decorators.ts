import { applyDecorators, createParamDecorator, ExecutionContext, InternalServerErrorException, UseGuards, SetMetadata } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserRole } from '../interfaces/user.interfaces';
import { UserRoleGuard } from './user-role.guard';

export function Auth(...roles: UserRole[]) {
    return applyDecorators(
        RoleProtected(...roles),
        UseGuards(AuthGuard(), UserRoleGuard),
    );
}

export const GetUser = createParamDecorator(
    (data: string, ctx: ExecutionContext ) => {
        const req = ctx.switchToHttp().getRequest();
        const user = req.user;

        if (!user) throw new InternalServerErrorException('User not found (request)');
        
        return (!data) 
            ? user 
            : user[data];
    }
);

export const RoleProtected = (...args: UserRole[] ) => {
    return SetMetadata( 'roles' , args);
}