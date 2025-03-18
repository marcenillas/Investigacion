import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import axios from 'axios';

import { validate as isUUID } from 'uuid';

import { defaultDBUsers, handleDBErrors } from '../../common/helpers/Database.helper';
import { TransactionFilterDTO, TransactionFilterTerminalDTO, TransactionInsertDTO, TransactionUpdateDTO } from '../dtos/transaction.data';
import { PaginationDTO } from '../../common/dtos/pagination.data';
import { Transaction } from '../entities/transaction.entity';
import { TransactionStatus, TransactionStep } from '../interfaces/transactions.interfaces';
import { TransactionLog } from '../entities/transactionLog.entity';
import { Configuration } from '../entities/configuration.entity';
import { Terminal } from '../entities/terminal.entity';
import * as mqtt from 'mqtt'

@Injectable()
export class TransactionService implements OnModuleInit{

    private readonly logger = new Logger('TransactionService');
    private mqttClient: mqtt.MqttClient;

    constructor(
        @InjectRepository(Transaction)
        private readonly repo: Repository<Transaction>,
        @InjectRepository(TransactionLog)
        private readonly repoL: Repository<TransactionLog>,
        @InjectRepository(Configuration)
        private readonly repoC: Repository<Configuration>,
        @InjectRepository(Terminal)
        private readonly repoT: Repository<Terminal>,


        private readonly ds: DataSource,
    ) { }

    async create(d: TransactionInsertDTO): Promise<Transaction> {
        try {
            delete d.transactionId;
            const row = await this.repo.save(this.repo.create({ ...d, ...defaultDBUsers }));
            const rowT = await this.repoT.findOneBy({ terminalId: row.terminalId });
            rowT.lastTransaction = new Date();
            await this.repoT.save(rowT);

            return row;

        } catch (error) {
            handleDBErrors(error);
        }
    }

    async update(id: string, d: TransactionUpdateDTO): Promise<Transaction> {
        try {
            const row = await this.repo.preload({ transactionId: id, ...d });

            if (!row) throw new NotFoundException(`Row with id: ${id} not found`);

            return await this.repo.save(row);
        } catch (error) {
            handleDBErrors(error);
        }
    }

    async updateData(id: string, d: TransactionUpdateDTO): Promise<Transaction> {
        try {
            delete d.orderRequestData;
            delete d.orderResponseData;
            if (d.cashierData == null || d.cashierData == "")
                delete d.cashierData
            if (d.copies == null || d.copies <= 0)
                delete d.copies
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

    async findAll(d: PaginationDTO): Promise<{ data: Transaction[], count: number }> {
        let transactions = await this.repo
            .createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.terminal', 'terminal')
            .select(['transaction', 'terminal.name'])
            .orderBy('transaction.stamp', 'DESC');

        if (d && d.limit) {
            transactions = transactions.take(d.limit).skip(d.offset * d.limit);
        }
        const [data, count] = await transactions.getManyAndCount();

        return { data, count };
    }


    async findOne(term: string): Promise<Transaction> {
        let row: Transaction;

        if (isUUID(term)) {


            const queryBuilder = this.repo.createQueryBuilder('transaction')
                .leftJoinAndSelect('transaction.terminal', 'terminal') // Carga la relación con la entidad Terminal
                .select(['transaction', 'terminal.name'])
                .where('transaction.transactionId = :term', { term })
                .getOne();

            return queryBuilder;


        } else {
            row = await this.repo.findOneBy({ description: term });
        }

        if (!row) throw new NotFoundException(`Row with id or description '${term}' not found`);

        return row;
    }

    async process(notification: any): Promise<void> {
        try {
          if (notification && typeof notification === 'object' && Object.keys(notification).length > 0) {
            let c = await this.repoC.find({ take: 1 });
            const authorizationToken = c[0].mpAuthorizationToken;
      
            let op = 0;
            let url = '';
      
            if (notification.resource) {
              url = notification.resource;
              op = 1;
            } else if (notification.data && notification.data.id) {
              url = `https://api.mercadopago.com/v1/payments/${notification.data.id}`;
              op = 2;
            } else {
              throw new Error('Invalid notification structure');
            }
      
            const config = {
              method: 'get',
              maxBodyLength: Infinity,
              url: url,
              headers: {
                'Authorization': 'Bearer ' + authorizationToken,
              },
            };
      
            const response = await axios.request(config);
            const id = response.data.external_reference;
            const status = response.data.status;
      
            const row = await this.findOne(id);
            if (row) {
              if (op === 1) {
                row.merchantOrderData = JSON.stringify(response.data);
                await this.saveTransactionLog(
                  id,
                  'Recibir el pago',
                  TransactionStep.ReceiveMerchantOrder,
                  JSON.stringify(await this.generateDataLog('OrdenId: ' + response.data.id, response.data))
                );
              } else if (op === 2) {
                const sumByType = await this.getSumByType(response.data.charges_details);
                row.mpCode = response.data.id;
                row.mpFee = sumByType.fee;
                row.mpTax = sumByType.tax;
                row.paymentMethod = response.data.payment_method.id;
                row.mptotal = response.data.transaction_details.net_received_amount;
      
                if (c[0].feeBorneClientCharge) {
                  row.feeBorneClientCharge = c[0].feeBorneClientCharge;
                  row.amount = row.amount - sumByType.fee;
                }
                row.paymentData = JSON.stringify(response.data);
                await this.saveTransactionLog(
                  id,
                  'Recibir la orden del comerciante',
                  TransactionStep.ReceivePayment,
                  JSON.stringify(await this.generateDataLog('PagoId: ' + response.data.id, response.data))
                );
              }
      
              if (status === 'approved' || status === 'closed') {
                if (row.status === TransactionStatus.Cancel) {
                  row.status = TransactionStatus.CancelPayment;
                } else {
                  row.status = TransactionStatus.Finished;
                }
              }
              await this.repo.save(row);
            } else {
              this.logger.error(`"NO TID :" ${id}`);
              // TODO: ver de grabar sin transaccion
              // await saveTransactionLog(id , "ReceiveMPError" ,TransactionStep.ReceiveMPError , JSON.stringify(notification))
            }
          }
        } catch (error) {
          this.logger.error(error.message);
        }
      }

    async getSumByType(vchargesDetails: any) {

        const sumByType = vchargesDetails.reduce((acc, charge) => {
            const type = charge.type;
            const originalAmount = charge.amounts.original;

            if (!acc[type]) {
                acc[type] = 0;
            }

            acc[type] += originalAmount;
            return acc;
        }, {});

        return sumByType;



    }

    async generateDataLog(vinfo: string, vdata: string): Promise<{ info: string, data: string }> {
        return {
            info: vinfo,
            data: vdata
        };
    }


    async saveTransactionLog(transacitionId: any, description: any, step: TransactionStep, vdata: any) {
        try {
            if (transacitionId) {
                const row = new TransactionLog();
                row.description = description,
                    row.data = vdata;
                row.step = step;
                row.transactionId = transacitionId;
                row.stamp = new Date();


                await this.repoL.save(row);
            }
        } catch (error) {
            this.logger.error(error.message);
        }
    }

    async deleteAll() {
        try {
            return await this.repo.createQueryBuilder('transaction')
                .delete()
                .where({})
                .execute();

        } catch (error) {
            handleDBErrors(error);
        }
    }

    async internalSave(d: Transaction) {
        try {

            await this.repo.save(d);
        } catch (error) {
            handleDBErrors(error);
        }
    }

    async findByFilter(filter: TransactionFilterDTO): Promise<{ data: Transaction[], count: number }> {
        const query = this.repo.createQueryBuilder('transaction')
            .leftJoinAndSelect('transaction.terminal', 'terminal')
            .select(['transaction', 'terminal.name'])
            .orderBy('transaction.stamp', 'DESC');
        if (filter.terminalList && filter.terminalList.length > 0) {
            query.andWhere('transaction.terminalId IN (:...terminalIds)', {
                terminalIds: filter.terminalList
            });
        }

        if (filter.statusList && filter.statusList.length > 0) {
            query.andWhere('transaction.status IN (:...statuses)', {
                statuses: filter.statusList,
            });
        }

        if (filter.from) {
            query.andWhere('transaction.stamp >= :from', { from: filter.from });
        }

        if (filter.to) {

            const dateto = new Date(filter.to);
            dateto.setDate(dateto.getDate() + 1);
            query.andWhere('transaction.stamp <= :to', { to: dateto.toISOString().split('T')[0] });

        }

        if (filter.limit) {
            query.take(filter.limit).skip(filter.offset * filter.limit);
        }

        const [data, count] = await query.getManyAndCount();

        return { data, count };


    }

    async findByTerminal(filter: TransactionFilterTerminalDTO): Promise<{ data: Transaction[], count: number }> {

        const f = new TransactionFilterDTO();
        f.terminalList = f.terminalList || []; // Asegúrate de que la lista esté inicializada

        f.terminalList.push(filter.terminalId);

        var result = await this.findByFilter(f);

        return result;

        // const limitedData = result.data.slice(0, 3);

        //return { data: limitedData, count: limitedData.length };

    }

    onModuleInit() {
        this.logger.debug('Inicializando el cliente MQTT...');
        this.mqttClient = mqtt.connect('mqtt://localhost:1883');
    
        this.mqttClient.on('connect', () => {
          this.logger.debug('Cliente MQTT conectado.');
          this.mqttClient.subscribe('mercadoPago/notifications', (err) => {
            if (!err) {
              this.logger.debug('Suscripción a mercadoPago/notifications exitosa.');
            } else {
              this.logger.error('Error en la suscripción a mercadoPago/notifications:', err);
            }
          });
        });
    
        this.mqttClient.on('message', (topic, message) => {
          this.logger.debug('Mensaje recibido en el tópico:', topic);
          if (topic === 'mercadoPago/notifications') {
            const notification = JSON.parse(message.toString());
            this.handleNotification(notification);
          }
        });
    
        this.mqttClient.on('error', (error) => {
         // this.logger.error('Error en la conexión MQTT:', error);
        });
      }
    
      async  handleNotification(notification: any) {
        this.logger.debug('Notificación recibida:', notification);
        await this.process(notification)
      }

}