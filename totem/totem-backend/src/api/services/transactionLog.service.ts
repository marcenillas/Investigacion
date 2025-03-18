import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import axios from 'axios';

import { validate as isUUID } from 'uuid';

import { defaultDBUsers, handleDBErrors } from '../../common/helpers/Database.helper';
import { TransactionInsertDTO, TransactionUpdateDTO } from '../dtos/transaction.data';
import { PaginationDTO } from '../../common/dtos/pagination.data';
import { Transaction } from '../entities/transaction.entity';
import { TransactionStatus } from '../interfaces/transactions.interfaces';
import { TransactionLog } from '../entities/transactionLog.entity';
import { TransactionLogInsertDTO, TransactionLogUpdateDTO } from '../dtos/transactionLog.data';

@Injectable()
export class TransactionLogService {

    private readonly logger = new Logger('TransactionLogService');

    constructor(
        @InjectRepository(TransactionLog)
        private readonly repo: Repository<TransactionLog>,

        private readonly ds: DataSource,
    ) { }

    async create(d: TransactionLogInsertDTO): Promise<TransactionLog> {
        try {
            delete d.transactionLogId;
            return await this.repo.save(this.repo.create({ ...d, ...defaultDBUsers }));
        } catch (error) {
            handleDBErrors(error);
        }
    }

    async update(id: string, d: TransactionLogUpdateDTO): Promise<TransactionLog> {
        try {
            const row = await this.repo.preload({ transactionId: id, ...d });

            if (!row) throw new NotFoundException(`Row with id: ${id} not found`);

            return await this.repo.save(row);
        } catch (error) {
            handleDBErrors(error);
        }
    }

    async delete(id: string) {
        await this.repo.remove(await this.findOne(id));
    }

    async findAll(d: PaginationDTO): Promise<TransactionLog[]> {
        return !d?
            await this.repo.find({ order: { stamp: 'DESC' } }) : 
            await this.repo.find({ take: d.limit, skip: d.offset, order: { stamp: 'DESC' } })
    }

    async findOne(term: string): Promise<TransactionLog> {

        let row: TransactionLog;
        row = await this.repo.findOneBy({ transactionLogId: term });
        if (!row) throw new NotFoundException(`Row with id or description '${term}' not found`);

        return row;
    }

    async findByTransaction(id: string): Promise<TransactionLog[]> {

        const transactionsLog = await this.repo
        .createQueryBuilder('transactionLog')                
        .orderBy('transactionLog.stamp', 'ASC')
        .where('transactionLog.transactionId = :id', { id })
        .getMany();
        return transactionsLog;
      
          
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
}