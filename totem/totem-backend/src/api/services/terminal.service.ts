import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { validate as isUUID } from 'uuid';

import { defaultDBUsers, handleDBErrors } from '../../common/helpers/Database.helper';
import { TerminalInsertDTO, TerminalStateDTO, TerminalUpdateDTO } from '../dtos/terminal.data';
import { PaginationDTO } from '../../common/dtos/pagination.data';
import { Terminal } from '../entities/terminal.entity';

import { TerminalStatus } from '../interfaces/terminal.interfaces';

@Injectable()
export class TerminalService {

    private readonly logger = new Logger('TerminalService');
    private readonly timerstatus = 8

    constructor(
        @InjectRepository(Terminal)
        private readonly repo: Repository<Terminal>,

    ) { }

    async create(d: TerminalInsertDTO): Promise<Terminal> {
        try {
            delete d.terminalId;

            const row = await this.repo.save(this.repo.create({ ...d, ...defaultDBUsers }));

            if (d.carrouselImageData01S)
                row.carrouselImageData01 = Buffer.from(d.carrouselImageData01S, 'base64')
            if (d.carrouselImageData02S)
                row.carrouselImageData02 = Buffer.from(d.carrouselImageData02S, 'base64')
            if (d.carrouselImageData03S)
                row.carrouselImageData03 = Buffer.from(d.carrouselImageData03S, 'base64')
            if (d.carrouselImageData04S)
                row.carrouselImageData04 = Buffer.from(d.carrouselImageData04S, 'base64')
            if (d.carrouselImageData05S)
                row.carrouselImageData05 = Buffer.from(d.carrouselImageData05S, 'base64')

            return await this.repo.save(row);

        } catch (error) {
            handleDBErrors(error);
        }
    }

    async update(id: string, d: TerminalUpdateDTO): Promise<Terminal> {
        try {
            const row = await this.repo.preload({ terminalId: id, ...d });
            if (!row) throw new NotFoundException(`Row with id: ${id} not found`);
            if (d.carrouselImageData01S)
                row.carrouselImageData01 = Buffer.from(d.carrouselImageData01S, 'base64')
            if (d.carrouselImageData02S)
                row.carrouselImageData02 = Buffer.from(d.carrouselImageData02S, 'base64')
            if (d.carrouselImageData03S)
                row.carrouselImageData03 = Buffer.from(d.carrouselImageData03S, 'base64')
            if (d.carrouselImageData04S)
                row.carrouselImageData04 = Buffer.from(d.carrouselImageData04S, 'base64')
            if (d.carrouselImageData05S)
                row.carrouselImageData05 = Buffer.from(d.carrouselImageData05S, 'base64')


            if (!d.carrouselImage01)
                row.carrouselImageData01 = null;

            if (!d.carrouselImage02)
                row.carrouselImageData02 = null;

            if (!d.carrouselImage03)
                row.carrouselImageData03 = null;

            if (!d.carrouselImage04)
                row.carrouselImageData04 = null;

            if (!d.carrouselImage05)
                row.carrouselImageData05 = null;

            return await this.repo.save(row);
        } catch (error) {
            handleDBErrors(error);
        }
    }



    async delete(id: string) {
        await this.repo.remove(await this.findOne(id));
    }

    async findAll(d: PaginationDTO): Promise<Terminal[]> {
        let terminals: Terminal[];

        if (!d) {
            terminals = await this.repo.find();
        } else {
            terminals = await this.repo.find({ take: d.limit, skip: d.offset });
        }

        const now = new Date();
        const updatedTerminals = terminals.map((terminal) => {
            if (terminal.lastConnection && ((now.getTime() - new Date(terminal.lastConnection).getTime()) / 1000 > this.timerstatus)) {
                terminal.status = TerminalStatus.Offline;

            }
            else if (terminal.lastConnection) {
                terminal.status = TerminalStatus.Online;
            }
            else {
                terminal.status = TerminalStatus.Initializing;
            }
            return terminal;
        });

        return updatedTerminals;
    }

    async findOne(term: string): Promise<Terminal> {

        let row: Terminal;

        if (isUUID(term)) {
            row = await this.repo.findOneBy({ terminalId: term })
        } else {
            row = await this.repo.findOneBy({ name: term });
        }

        if (!row) throw new NotFoundException(`Row with id or name '${term}' not found`);



        const now = new Date();


        if (row.lastConnection && ((now.getTime() - new Date(row.lastConnection).getTime()) / 1000 > this.timerstatus)) {
            row.status = TerminalStatus.Offline;
        }
        else if (row.lastConnection) {
            row.status = TerminalStatus.Online;
        }
        else {
            row.status = TerminalStatus.Offline;
        }
        return row;
    }



    async findByCode(codes: string[]): Promise<Terminal> {

        const query = this.repo.createQueryBuilder('terminal')
        .where('terminal.code IN (:...codes)', { codes })        
        .setParameter('codes', codes)
        .getOne();
  
      const row = await query;
  
      if (!row) {
        throw new NotFoundException(`Row with code from the list '${codes}' not found`);
      }
  /*
      const now = new Date();
      if (row.lastConnection && ((now.getTime() - new Date(row.lastConnection).getTime()) / 1000 > this.timerstatus)) {
        row.status = TerminalStatus.Offline;
      } else if (row.lastConnection) {
        row.status = TerminalStatus.Online;
      } else {
        row.status = TerminalStatus.Offline;
      }
  */
      return row;
    }



    async checkStatus(term: string): Promise<TerminalStateDTO> {

        let row: Terminal;

        row = await this.repo.findOneBy({ terminalId: term })
        if (!row) throw new NotFoundException(`Row with id or name '${term}' not found`);

        row.lastConnection = new Date(),
            this.repo.save(row);


        const rtn: TerminalStateDTO = {
            terminalId: row.terminalId,
            enabled: row.enabled
        };

        return rtn;
    }




    async deleteAll() {
        try {
            return await this.repo.createQueryBuilder('terminal')
                .delete()
                .where({})
                .execute();

        } catch (error) {
            handleDBErrors(error);
        }
    }

    async uploadCarrousel(id: string, vimageNumber: string, file?: Express.Multer.File) {
        try {
            const row = await this.findOne(id);

            if (!row) {
                throw new Error('No se encontró la fila en la base de datos.');
            }

            const imageNumber = parseInt(vimageNumber, 10);



            switch (imageNumber) {
                case 1:
                    row.carrouselImage01 = file ? file.originalname : null;
                    row.carrouselImageData01 = file ? file.buffer : null;
                    break;
                case 2:
                    row.carrouselImage02 = file ? file.originalname : null;
                    row.carrouselImageData02 = file ? file.buffer : null;
                    break;
                case 3:
                    row.carrouselImage03 = file ? file.originalname : null;
                    row.carrouselImageData03 = file ? file.buffer : null;
                    break;
                case 4:
                    row.carrouselImage04 = file ? file.originalname : null;
                    row.carrouselImageData04 = file ? file.buffer : null;
                    break;
                case 5:
                    row.carrouselImage05 = file ? file.originalname : null;
                    row.carrouselImageData05 = file ? file.buffer : null;
                    break;
                default:
                    throw new Error('Número de imagen no válido');
            }

            await this.repo.save(row);
        } catch (error) {
            handleDBErrors(error);
        }
    }

    async internalSave(d: Terminal) {
        try {

            await this.repo.save(d);
        } catch (error) {
            handleDBErrors(error);
        }
    }
}