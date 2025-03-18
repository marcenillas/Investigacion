import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Terminal } from '../entities/terminal.entity';
import { Repository } from 'typeorm';
import { Configuration } from '../entities/configuration.entity';
import {  TerminalStateDTO } from '../dtos/terminal.data';
import { TransactionInsertDTO } from '../dtos/transaction.data';
import { OrderResponseDTO } from '../dtos/order.data';
import { MPDTO } from '../dtos/mp.data';

@Injectable()
export class MPservice {

    private readonly logger = new Logger('MPservice');

    constructor(
        @InjectRepository(Terminal)
        private readonly repoT: Repository<Terminal>,
        @InjectRepository(Configuration)
        private readonly repoC: Repository<Configuration>,

    ) { }

    async status(data: TerminalStateDTO): Promise<boolean> {

        let rtn = false;
        try {

            let urlmethod = 'mp/status';
            const datas = await this.generarMPDTO(data.terminalId);
            rtn = await this.executePost(urlmethod, datas);
        } catch (error) {
            this.logger.error(error);
        }     
        return rtn;


    }


    async generar(data: TransactionInsertDTO): Promise<OrderResponseDTO> {
        let rtn = new OrderResponseDTO();
        try {           
            let urlmethod = 'mp/generateOrder';
            const mpdto = await this.generarMPDTO(data.terminalId);
            const datas = {
                code: data.transactionId,
                totalAmount: data.total,
                title: 'Carga',
                description: 'Carga',
                mpdata: mpdto,
            }

            rtn = await this.executePost(urlmethod, datas);
        } catch (error) {
            this.logger.error(error);
        }
        return rtn;

    }



    async executePost(urlmethod: string, dataparams: any): Promise<any> {

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.MP_URI + urlmethod,
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(dataparams),

        };
        return axios.request(config)
            .then((response) => { return response.data; })
            .catch((error) => {
                throw error
            });
    }

    private async generarMPDTO(terminalId: string): Promise<MPDTO> {
        let c = await this.repoC.find({ take: 1 });
        let t = await this.repoT.findBy({ terminalId: terminalId });
        let mp = new MPDTO();
        mp.userid = c[0].mpUserId;
        mp.authorizationtoken = c[0].mpAuthorizationToken;    
        mp.expirateTransaction = c[0].mpExpirateTransaction.toString();
        mp.storeId = t[0].storeId;
        mp.posid = t[0].posId;
        return mp;
    }
}


