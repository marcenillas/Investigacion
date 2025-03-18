import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { defaultDBUsers, handleDBErrors } from '../../common/helpers/Database.helper';
import { PaginationDTO } from '../../common/dtos/pagination.data';
import { TransactionLog } from '../entities/transactionLog.entity';
import { OperatorLog } from '../entities/operatorLog.entity';
import { OperatorLogFilterDTO, OperatorLogInsertDTO, OperatorLogUpdateDTO } from '../dtos/operatorLog.data';
import { isUUID } from 'class-validator';

@Injectable()
export class OperatorLogService {

    private readonly logger = new Logger('TransactionLogService');

    constructor(
        @InjectRepository(OperatorLog)
        private readonly repo: Repository<OperatorLog>,

        private readonly ds: DataSource,
    ) { }

    async create(d: OperatorLogInsertDTO): Promise<OperatorLog> {
        try {
            delete d.operatorLogId;
            return await this.repo.save(this.repo.create({ ...d, ...defaultDBUsers }));
        } catch (error) {
            handleDBErrors(error);
        }
    }

    async update(id: string, d: OperatorLogUpdateDTO): Promise<OperatorLog> {
        try {
            const row = await this.repo.preload({ operatorLogId: id, ...d });

            if (!row) throw new NotFoundException(`Row with id: ${id} not found`);

            return await this.repo.save(row);
        } catch (error) {
            handleDBErrors(error);
        }
    }

    async delete(id: string) {
        await this.repo.remove(await this.findOne(id));
    }

    async findAll(d?: PaginationDTO): Promise<{ data: OperatorLog[], count: number }> {


        let ol = await this.repo
            .createQueryBuilder('operatorLog')
            .leftJoinAndSelect('operatorLog.terminal', 'terminal')
            .select(['operatorLog', 'terminal.name'])
            .orderBy('operatorLog.stamp', 'DESC');

        if (d && d.limit) {
            ol = ol.take(d.limit).skip(d.offset * d.limit);
        }
        const [data, count] = await ol.getManyAndCount();

        return { data, count };


    }
    async findOne(term: string): Promise<OperatorLog> {

        let row: OperatorLog;

        if (isUUID(term)) {

            const queryBuilder = this.repo.createQueryBuilder('operatorLog')
                .leftJoinAndSelect('operatorLog.terminal', 'terminal')
                .select(['operatorLog', 'terminal.name'])
                .where('operatorLog.operatorLogId = :term', { term })
                .getOne();

            return queryBuilder;


        } else {
            row = await this.repo.findOneBy({ description: term });
        }

        if (!row) throw new NotFoundException(`Row with id or code '${term}' not found`);

        return row;
    }


    async deleteAll() {
        try {
            return await this.repo.createQueryBuilder('transactionLog')
                .delete()
                .where({})
                .execute();

        } catch (error) {
            handleDBErrors(error);
        }
    }


    async findByFilter(filter: OperatorLogFilterDTO): Promise<{ data: OperatorLog[], count: number }> {
        const query = this.repo.createQueryBuilder('operaratorLog')
            .leftJoinAndSelect('operaratorLog.terminal', 'terminal')
            .select(['operaratorLog', 'terminal.name'])
            .orderBy('operaratorLog.stamp', 'DESC');
        if (filter.terminalList && filter.terminalList.length > 0) {
            query.andWhere('operaratorLog.terminalId IN (:...terminalIds)', {
                terminalIds: filter.terminalList
            });
        }

        if (filter.operatorActionList && filter.operatorActionList.length > 0) {
            query.andWhere('operaratorLog.operatorAction IN (:...actions)', {
                actions: filter.operatorActionList,
            });
        }

        if (filter.operatorList && filter.operatorList.length > 0) {
            query.andWhere('operaratorLog.operatorEmail IN (:...operatorEmails)', {
                operatorEmails: filter.operatorList
            });
        }

        if (filter.from) {
            query.andWhere('operaratorLog.stamp >= :from', { from: filter.from });
        }
      
        if (filter.to) {

           const dateto = new Date(filter.to);            
            dateto.setDate(dateto.getDate() + 1);
            query.andWhere('operaratorLog.stamp <= :to', { to: dateto.toISOString().split('T')[0] });
        }

        if (filter.limit) {
            query.take(filter.limit).skip(filter.offset * filter.limit);
        }

        const [data, count] = await query.getManyAndCount();

        return { data, count };


    }



}