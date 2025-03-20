import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { handleDBErrors, defaultDBUsers } from '../../common/helpers/Database.helper';
import { ConfigurationInsertDTO, ConfigurationUpdateDTO } from '../dtos/configuration.data';
import { Configuration } from '../entities/configuration.entity';

@Injectable()
export class ConfigurationService {

    private readonly logger = new Logger('ConfigService');

    constructor(
        @InjectRepository(Configuration)
        private readonly repo: Repository<Configuration>,
    ) { }

    async create(d: ConfigurationInsertDTO): Promise<Configuration> {
        try {
            delete d.configurationId;
            const row = await this.repo.save(this.repo.create({ ...d, ...defaultDBUsers }));

            if (d.logoMPImageDataS)
                row.logoMPImageData = Buffer.from(d.logoMPImageDataS, 'base64')
            if (d.logoBranchImageDataS)
                row.logoBranchImageData = Buffer.from(d.logoCompanyImageDataS, 'base64')
            if (d.logoCompanyImageDataS)
                row.logoCompanyImageData = Buffer.from(d.logoCompanyImageDataS, 'base64')

            return await this.repo.save(row);

        } catch (error) {
            handleDBErrors(error);
        }
    }

    async update(id: string, d: ConfigurationUpdateDTO): Promise<Configuration> {
        try {           
            const row = await this.repo.preload({ configurationId: id, ...d, updatedBy: defaultDBUsers.updatedBy });

            if (!row) throw new NotFoundException(`Row with id: ${id} not found`);


            if (d.logoMPImageDataS)
                row.logoMPImageData = Buffer.from(d.logoMPImageDataS, 'base64')
            if (d.logoBranchImageDataS)
                row.logoBranchImageData = Buffer.from(d.logoCompanyImageDataS, 'base64')
            if (d.logoCompanyImageDataS)
                row.logoCompanyImageData = Buffer.from(d.logoCompanyImageDataS, 'base64')

            if (!d.logoMPImage) 
                row.logoMPImageData = null;
            
            if (!d.logoBranchImage) 
                row.logoBranchImageData = null;
            
            if (!d.logoCompanyImage) 
                row.logoCompanyImageData = null;
        

            return await this.repo.save(row);
        } catch (error) {
            handleDBErrors(error);
        }
    }

    async findAll(): Promise<Configuration[]> {
        const data = await this.repo.find({ take: 1 });    
        return data;
    }

    async deleteConfiguration() {
        try {
            return await this.repo.createQueryBuilder('configuration')
                .delete()
                .where({})
                .execute();

        } catch (error) {
            handleDBErrors(error);
        }
    }

    async uploadLogo(voption: string, logo?: Express.Multer.File) {
        try {
            const lrow = await this.repo.find({ take: 1 });

            if (!lrow) {
                throw new Error('No se encontró la fila en la base de datos.');
            }
            const row = lrow[0];
           
            const op = parseInt(voption, 10);



            switch (op) {
                case 1:

                    row.logoMPImageData = logo ? logo.buffer : null;
                    break;
                case 2:

                    row.logoBranchImageData = logo ? logo.buffer : null;
                    break;
                case 3:

                    row.logoCompanyImageData = logo ? logo.buffer : null;
                    break;

                default:
                    throw new Error('Número de imagen no válido');
            }





            await this.repo.save(row);
        } catch (error) {
            handleDBErrors(error);
        }
    }

    async internalSave(d: Configuration) {
        try {

            await this.repo.save(d);
        } catch (error) {
            handleDBErrors(error);
        }
    }
}