import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';

import { User } from '../entities/user.entity';
import { JWTPayload } from '../interfaces/user.interfaces';
import { UserStatus } from '../interfaces/user.interfaces';

@Injectable()
export class AuthStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
        configService: ConfigService
    ) {
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });
    }

    async validate(payload: JWTPayload): Promise<User> {
        const { userId } = payload;

        const user = await this.repo.findOneBy({ userId });

        if (!user) throw new UnauthorizedException('Token not valid')

        if (!user.enabled) throw new UnauthorizedException('User is inactive, talk with an admin');

        return user;
    }
}