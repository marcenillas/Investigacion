import { Get, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import * as xml2js from 'xml2js';
import * as qs from 'qs';
import { CashResponse, CashResponseVoucher } from '../dtos/cash.data';

@Injectable()
export class CashService {

    private readonly logger = new Logger('Cashservice');

    constructor() { }

    async status(macAddressId: string): Promise<CashResponse> {
        let rtn = new CashResponse();
        try {
            let urlmethod = 'Status';
            const data = qs.stringify({ 'macAddressId': macAddressId });
            rtn = await this.parseXmlToCashResponse(await this.executePost(urlmethod, data));


        } catch (error) {
            rtn.Value = -99
            rtn.Message = error.message
        }
        return rtn;
    }


    async generar(macAddressId: string, iMontoCents: string): Promise<CashResponseVoucher> {

        let rtn = new CashResponseVoucher();
        try {
            let urlmethod = 'Generar';
            let data = qs.stringify({
                'macAddressId': macAddressId,
                'iImporteCents': iMontoCents
            });
             rtn = await this.parseXmlToCashTicket(await this.executePost(urlmethod, data));


        } catch (error) {
            rtn.Code = -99
            rtn.Message = error.message
        }
        return rtn
    }

    async consulta(macAddressId: string, validationId: string): Promise<string[]> {           
        try {
            let urlmethod = 'Consulta';
            let data = qs.stringify({
                'macAddressId': macAddressId,
                'validationId': validationId
            });
            const rtn = await this.parseXmlToStringList(await this.executePost(urlmethod, data));
            return rtn

        } catch (error) {
            
            this.logger.error(error.message);
        }
    }



    async pago(macAddressId: string, validationId: string, iMontoCents: string): Promise<string[]> {
        try {


            let urlmethod = 'Pago';
            let data = qs.stringify({
                'macAddressId': macAddressId,
                'validationId': validationId,
                'iMontoCents': iMontoCents
            });
            const rtn = await this.parseXmlToStringList(await this.executePost(urlmethod, data));
            return rtn

        } catch (error) {
            this.logger.error(error.message);
        }
    }


    async cancelar(macAddressId: string, validationId: string, iMontoCents: string): Promise<string[]> {
        try {
            let urlmethod = 'Cancelar';
            let data = qs.stringify({
                'macAddressId': macAddressId,
                'validationId': validationId,
                'iMontoCents': iMontoCents
            });
            const rtn = await this.parseXmlToStringList(await this.executePost(urlmethod, data));
            return rtn

        } catch (error) {
            this.logger.error(error.message);
        }
    }


    async executeGet(urlparams: string): Promise<string> {

        const config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: process.env.CASH_URI + urlparams,
            headers: {
                'Content-Type': 'text/xml; charset=utf-8'
            }
            
        };        
        const response = await axios.request(config);        
        return response.data;
    }


    async executePost(urlmethod: string, dataparams: any): Promise<string> {

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.CASH_URI + urlmethod,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: dataparams,
            timeout:parseInt(process.env.CASH_TIMEOUT,10),
        };        
        const response = await axios.request(config);        
        return response.data;
    }


    async parseXmlToCashResponse(xmlString: string): Promise<CashResponse> {
        const result = await xml2js.parseStringPromise(xmlString);
        const [value, message] = result.string._.split('|');
        const classInstance = new CashResponse();
        classInstance.Value = value;
        classInstance.Message = message;
        return classInstance;
    }


    async parseXmlToCashTicket(xmlString: string): Promise<CashResponseVoucher> {
        const result = await xml2js.parseStringPromise(xmlString);
        let array = result.string._.split('|');
        const classInstance = new CashResponseVoucher();
        if (array.length == 1) {
            classInstance.Code = array[0];
            classInstance.Message = array[1];


        }
        else {

            classInstance.Code = array[0];
            classInstance.ValidationId = array[1];
            classInstance.CreateDate = array[2];
            classInstance.ExpirateDate = array[3];
            if (array.length >= 5) {
                classInstance.Branch = array[4];
            }
            if (array.length >= 6) {
                classInstance.Data1 = array[5];
            }
            if (array.length >= 7) {
                classInstance.Data2 = array[6];
            }

        }


        return classInstance;
    }


    async parseXmlToStringList(xmlString: string): Promise<string[]> {
        const result = await xml2js.parseStringPromise(xmlString);
        const rtn = result.string[0].split('|'); 
        return rtn;
    }
}


