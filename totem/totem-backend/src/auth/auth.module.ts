import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { User } from './entities/user.entity';
import { AuthStrategy } from './strategy/auth.strategy';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
    controllers: [AuthController, UserController],
    providers: [AuthService, UserService, AuthStrategy],
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([User]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                return {
                    secret: configService.get('JWT_SECRET'),
                    signOptions: {
                        expiresIn: '2h'
                    }
                }
            }
        })
    ],
    exports: [TypeOrmModule, AuthStrategy, PassportModule, JwtModule]
})
export class AuthModule { }