import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';
import { validate as isUUID } from 'uuid';

import { handleDBErrors } from '../../common/helpers/Database.helper';
import { UserInsertDTO, UserOutputDTO, UserUpdateDTO } from '../dtos/user.data';
import { PaginationDTO } from '../../common/dtos/pagination.data';
import { User } from '../entities/user.entity';

@Injectable()
export class UserService {

    private readonly logger = new Logger('UserService');

    constructor(
        @InjectRepository(User)
        private readonly repo: Repository<User>,
    ) { }

    async create(d: UserInsertDTO): Promise<User> {
        try {
            delete d.userId;
            d.password = bcrypt.hashSync(d.password, 10)

            let thisRoles = [];

            if (d.user) thisRoles.push("1");
            if (d.admin) thisRoles.push("2");
            if (d.operator) thisRoles.push("3");

            const r = await this.repo.save(this.repo.create({ ...d, roles: thisRoles }));

            delete r.password;
            return r;
        } catch (error) {
            handleDBErrors(error);
        }
    }

    async update(id: string, d: UserUpdateDTO): Promise<User> {
        try {
            delete d.password;
            const preRow = await this.repo.preload({ userId: id, ...d });

            if (!preRow) throw new NotFoundException(`Row with id: ${id} not found`);

            let thisRoles = [];

            if (d.user) thisRoles.push("1");
            if (d.admin) thisRoles.push("2");
            if (d.operator) thisRoles.push("3");

            preRow.roles = thisRoles;

            const r = await this.repo.save(preRow);
            delete r.password;

            return r;
        } catch (error) {
            handleDBErrors(error);
        }
    }

    async delete(id: string) {
        await this.repo.remove(await this.repo.findOneBy({ userId: id }));
    }

    async findAll(d: PaginationDTO): Promise<UserOutputDTO[]> {
        const { limit = 10, offset = 0 } = d;

        const rows = await this.repo.find({
            take: limit,
            skip: offset,
            order: { fullName: 'ASC' }
        })

        let dtos = [];

        rows.forEach(r => {
            dtos.push({
                userId: r.userId,
                fullName: r.fullName,
                email: r.email,
                enabled: r.enabled,
                user: r.roles.includes(1),
                admin: r.roles.includes(2),
                operator: r.roles.includes(3),
            });
        });
        return dtos;
    }

    async findOne(id: string): Promise<UserOutputDTO> {
        let row: User;

        if (isUUID(id)) {
            row = await this.repo.findOneBy({ userId: id })
        }

        if (!row) throw new NotFoundException(`Row with id '${id}' not found`);

        return {
            userId: row.userId,
            fullName: row.fullName,
            email: row.email,
            enabled: row.enabled,
            user: row.roles.includes(1),
            admin: row.roles.includes(2),
            operator: row.roles.includes(3),
        };
    }

    async deleteAll() {
        try {
            return await this.repo.createQueryBuilder('user')
                .delete()
                .where({})
                .execute();

        } catch (error) {
            handleDBErrors(error);
        }
    }    
}


