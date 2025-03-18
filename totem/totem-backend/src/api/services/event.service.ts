import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { validate as isUUID } from 'uuid';

import { defaultDBUsers, handleDBErrors } from '../../common/helpers/Database.helper';
import { EventInsertDTO, EventUpdateDTO, EventFilterDTO } from '../dtos/event.data';
import { PaginationDTO } from '../../common/dtos/pagination.data';
import { Event } from '../entities/event.entity';
import { Terminal } from '../entities/terminal.entity';

@Injectable()
export class EventService {

    private readonly logger = new Logger('EventService');

    constructor(
        @InjectRepository(Event)
        private readonly repo: Repository<Event>,
        @InjectRepository(Terminal)
        private readonly repoT: Repository<Terminal>,

        private readonly ds: DataSource,
    ) { }

    async create(d: EventInsertDTO): Promise<Event> {
        try {
            delete d.eventId;
            const row = await this.repo.save(this.repo.create({ ...d, ...defaultDBUsers }));
           
            const rowT = await this.repoT.findOneBy({ terminalId: row.terminalId });
            rowT.lastEvent = new Date();
            await this.repoT.save(rowT);

            return row;

        } catch (error) {
            handleDBErrors(error);
        }
    }

    async update(id: string, d: EventUpdateDTO): Promise<Event> {
        try {
            const row = await this.repo.preload({ eventId: id, ...d });

            if (!row) throw new NotFoundException(`Row with id: ${id} not found`);

            return await this.repo.save(row);
        } catch (error) {
            handleDBErrors(error);
        }
    }

    async delete(id: string) {
        await this.repo.remove(await this.findOne(id));
    }

    async findAll(d?: PaginationDTO):Promise<{data:Event[] ,count : number}> {


            let events = await this.repo
            .createQueryBuilder('event')
            .leftJoinAndSelect('event.terminal', 'terminal')
            .select(['event', 'terminal.name'])
            .orderBy('event.stamp', 'DESC');

        if (d && d.limit ) {
            events = events.take(d.limit).skip(d.offset * d.limit);
        }
        const [data, count] = await events.getManyAndCount();
        
        return { data, count };


    }

    async findOne(term: string): Promise<Event> {

        let row: Event;

        if (isUUID(term)) {
          
            const queryBuilder = this.repo.createQueryBuilder('event')
            .leftJoinAndSelect('event.terminal', 'terminal') // Carga la relación con la entidad Terminal
            .select(['event', 'terminal.name'])
            .where('event.eventId = :term', { term })
            .getOne();

        return queryBuilder;


        } else {
            row = await this.repo.findOneBy({ code: term });
        }

        if (!row) throw new NotFoundException(`Row with id or code '${term}' not found`);

        return row;
    }

    async deleteAll() {
        try {
            return await this.repo.createQueryBuilder('event')
                .delete()
                .where({})
                .execute();

        } catch (error) {
            handleDBErrors(error);
        }
    }

    async findByFilter(filter: EventFilterDTO): Promise<{data:Event[] ,count : number}> {
        const query = this.repo.createQueryBuilder('event')
        .leftJoinAndSelect('event.terminal', 'terminal') // Carga la relación con la entidad Terminal
        .select(['event', 'terminal.name']);
        if (filter.terminalList && filter.terminalList.length > 0) {
            query.andWhere('event.terminalId IN (:...terminalIds)', {
                terminalIds: filter.terminalList
            });
        }

        if (filter.typeList && filter.typeList.length > 0) {
            query.andWhere('event.type IN (:...types)', {
                types: filter.typeList,
            });
        }

        if (filter.from) {
            query.andWhere('event.stamp >= :from', { from: filter.from });
        }

        if (filter.to) {

            const dateto = new Date(filter.to);            
            dateto.setDate(dateto.getDate() + 1);
            query.andWhere('event.stamp <= :to', { to: dateto.toISOString().split('T')[0] });
            
        }

        if ( filter.limit ) {
            query.take(filter.limit).skip(filter.offset * filter.limit);
        }

        const [data, count] = await query.getManyAndCount();
        
        return { data, count };

       
    }
}