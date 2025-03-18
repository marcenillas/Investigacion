import { Injectable, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

import { User } from '../entities/user.entity';
import { UserLoginDTO, UserInsertDTO, UserAccountDTO } from '../dtos/user.data';
import { JWTPayload } from '../interfaces/user.interfaces';
import { handleDBErrors } from '../../common/helpers/Database.helper';

@Injectable()
export class AuthService {

    private readonly logger = new Logger('AuthService');

    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,

        private readonly jwt: JwtService,
    ) { }

    async register(d: UserInsertDTO) {
        try {

            const { password, ...userData } = d;

            const user = this.repo.create({
                ...userData,
                password: bcrypt.hashSync(password, 10)
            });

            await this.repo.save(user)
            delete user.password;

            return {
                ...user,
                token: this.getJwtToken({ userId: user.userId })
            };
        } catch (error) {
            handleDBErrors(error);
        }
    }

    async account(d: UserAccountDTO) {
        const preRow = await this.repo.preload({ userId: d.userId, ...d });

        if (!preRow) throw new NotFoundException(`Row with id: ${d.userId} not found`);

        const user = await this.repo.findOne({
            where: { email: preRow.email },
            select: { password: true }
        });

        if (!bcrypt.compareSync(d.password, user.password)) throw new UnauthorizedException('Invalid credentials');

        try {
            delete preRow.password;

            if (d.newPassword) {
                preRow.password = bcrypt.hashSync(d.newPassword, 10);
            }
            
            const r = await this.repo.save(preRow);
            delete r.password;
            return r;
        } catch (error) {
            handleDBErrors(error);
        }
    }

    async login(d: UserLoginDTO) {

        const { password, email } = d;

        const user = await this.repo.findOne({
            where: { email },
            select: { email: true, password: true, userId: true, fullName: true}
        });

        if (!user) throw new UnauthorizedException('Invalid credentials');

        if (!bcrypt.compareSync(password, user.password)) throw new UnauthorizedException('Invalid credentials');

        delete user.password;

        return {
            ...user,
            token: this.getJwtToken({ userId: user.userId })
        };
    }

    async checkStatus(user: User) {
        return {
            ...user,
            token: this.getJwtToken({ userId: user.userId })
        };
    }

    private getJwtToken(payload: JWTPayload) {
        const token = this.jwt.sign(payload);
        return token;
    }
}