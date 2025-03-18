import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ConfigurationService } from './configuration.service';
import { EventService } from './event.service';
import { TerminalService } from './terminal.service';
import { TransactionService } from './transaction.service';
import { TransactionLogService } from './transactionLog.service';
import { TerminalStatus } from '../interfaces/terminal.interfaces';
import { EventType } from '../interfaces/event.interfaces';
import { TransactionStatus, TransactionStep } from '../interfaces/transactions.interfaces';
import { Configuration } from '../entities/configuration.entity';
import { Repository } from 'typeorm';
import { logoMP, logoSala, logoSielcon, c1, c2, c3, c4, c5 } from './imageData';
@Injectable()
export class SeedService {

    constructor(
        private readonly configurationService: ConfigurationService,
        private readonly terminalService: TerminalService,
        private readonly eventService: EventService,
        private readonly transactionService: TransactionService,
        private readonly transactionLogService: TransactionLogService,
    ) { }

    async execute() {

        await this.deleteTables();

        return 'SEED EXECUTED';
    }

    private async deleteTables() {
        await this.configurationService.deleteConfiguration();
        await this.eventService.deleteAll();
        await this.transactionLogService.deleteAll();
        await this.transactionService.deleteAll();
        await this.terminalService.deleteAll();

        await this.insertData();
    }

    private async insertData() {
        let c = await this.configurationService.create({
            configurationId: '',
            mpAuthorizationToken: 'APP_USR-6407024715531601-030609-c9114c3665d2c6cc85a26704d5cb545f-1713092135',
            mpUserId: '1713092135',
            mpNotificationURL: 'https://rare-eagles-laugh.loca.lt/api/transaction/ReceiveNotifications', //Esto hay que cambiar con cada arranque
            taxPercentage: 1,
        });

        c.logoMPImage = "logomp.png"
        c.logoSalaImage = "logoSala.png"
        c.logoSielconImage = "logoSielcon.png"
        c.logoMPImageData = Buffer.from(logoMP, 'hex');
        c.logoSalaImageData = Buffer.from(logoSala, 'hex');;
        c.logoSielconImageData = Buffer.from(logoSielcon, 'hex');;
        this.configurationService.internalSave(c);

        const terminal_01 = await this.terminalService.create({
            terminalId: '',
            name: 'Terminal Planta Baja',
            description: 'Terminal ubicado en Planta Baja, habilitado sólo en horario diurno, modo QR Fijo y billetes de denominación general.',
            enabled: true, modeQR: true, modeFixed: false,
            status: TerminalStatus.Online,
            carrouselImage01: 'c1.png', carrouselImage02: 'c2.png', carrouselImage03: 'c3.png', carrouselImage04: 'c4.png', carrouselImage05: 'c5.png',
            definedValues: '100 | 200 | 500 | 1000 | 2000 | 5000 | 10000 | 50000',
            storeId: '9998', posId: '99988', printTITO: true, printTicket: true,
            printerTicketName: 'GP-80160(Cut) Series', printerTITOCom: 'COM7',

        });

        terminal_01.carrouselImageData01 = Buffer.from(c1, 'hex');
        terminal_01.carrouselImageData02 = Buffer.from(c2, 'hex');
        terminal_01.carrouselImageData03 = Buffer.from(c3, 'hex');
        terminal_01.carrouselImageData04 = Buffer.from(c4, 'hex');
        terminal_01.carrouselImageData05 = Buffer.from(c5, 'hex');
        this.terminalService.internalSave(terminal_01);

        /*
                await this.eventService.create({
                    eventId: '',
                    code: terminal_01.terminalId + '-papeout',
                    description: 'papeout',
                    data: 'papeout',
                    stamp: new Date(),
                    type: EventType.Warning,
                    terminalId: terminal_01.terminalId,
                });
        
                await this.eventService.create({
                    eventId: '',
                    code: terminal_01.terminalId + '-online',
                    description: 'online',
                    data: 'online',
                    stamp: new Date(),
                    type: EventType.Warning,
                    terminalId: terminal_01.terminalId,
                });
        
        
                await this.eventService.create({
                    eventId: '',
                    code: terminal_01.terminalId + '-open',
                    description: 'papeout',
                    data: 'papeout',
                    stamp: new Date(),
                    type: EventType.Warning,
                    terminalId: terminal_01.terminalId,
                });
        
                await this.eventService.create({
                    eventId: '',
                    code: terminal_01.terminalId + '-online',
                    description: 'online',
                    data: 'online',
                    stamp: new Date(),
                    type: EventType.Warning,
                    terminalId: terminal_01.terminalId,
                });
        
        
                const transaction_01 = await this.transactionService.create({
                    transactionId: '',
                    description: terminal_01.terminalId + ' - ' + new Date().toISOString().replace(/[^0-9]/g, "").slice(0, -5),
                    amount: 990.00,
                    taxPercentage: 1,
                    tax: 10,
                    total: 1000,
                    stamp: new Date(),
                    status: TransactionStatus.Cancel,
                    terminalId: terminal_01.terminalId,
                });
        
                transaction_01.orderRequestData = '{""method"":""POST"",""maxBodyLength"":null,""url"":""https://api.mercadopago.com/instore/orders/qr/seller/collectors/1713092135/pos/99988/qrs"",""headers"":{""Content-Type"":""application/json"",""Authorization"":""Bearer APP_USR-6407024715531601-030609-c9114c3665d2c6cc85a26704d5cb545f-1713092135""},""data"":""{\""external_reference\"":\""8c73119d-a870-4074-aff6-8e633fae34fa\"",\""total_amount\"":495,\""title\"":\""Carga\"",\""description\"":\""Carga\"",\""items\"":[{\""title\"":\""Ticket\"",\""description\"":\""Ticket\"",\""quantity\"":1,\""unit_measure\"":\""unit\"",\""unit_price\"":495,\""total_amount\"":495}],\""notification_url\"":\""https://rare-eagles-laugh.loca.lt/api/transaction/ReceiveNotifications\""}""}';
                transaction_01.orderResponseData = '{""in_store_order_id"":""424aedb6-80e1-44a0-a933-2ef31a7f6a15"",""qr_data"":""00020101021243650016com.mercadolibre020130636424aedb6-80e1-44a0-a933-2ef31a7f6a155011000711111115204970053030325802AR5909Test Test6004CABA63044ED8""}';
                this.transactionService.internalSave(transaction_01);
        
                await this.transactionLogService.create({
                    transactionLogId: '',
                    description: 'Nueva transacción',
                    data: '-',
                    step: TransactionStep.New,
                    stamp: new Date(),
                    transactionId: transaction_01.transactionId
                });
                await this.transactionLogService.create({
                    transactionLogId: '',
                    description: 'Enviar la transacción a MercadoPago',
                    data: '-',
                    step: TransactionStep.SendToMP,
                    stamp: new Date(),
                    transactionId: transaction_01.transactionId
                });
                await this.transactionLogService.create({
                    transactionLogId: '',
                    description: 'Recibir la transacción de MercadoPago',
                    data: '-',
                    step: TransactionStep.ReceiveFromMP,
                    stamp: new Date(),
                    transactionId: transaction_01.transactionId
                });
                await this.transactionLogService.create({
                    transactionLogId: '',
                    description: 'Cancelar el pago',
                    data: '-',
                    step: TransactionStep.CancelPayment,
                    stamp: new Date(),
                    transactionId: transaction_01.transactionId
                });
                await this.transactionLogService.create({
                    transactionLogId: '',
                    description: 'Imprimir el ticket',
                    data: '-',
                    step: TransactionStep.PrintTicket,
                    stamp: new Date(),
                    transactionId: transaction_01.transactionId
                });
        
        
                const transaction_02 = await this.transactionService.create({
                    transactionId: '',
                    description: terminal_01.terminalId + ' - ' + new Date().toISOString().replace(/[^0-9]/g, "").slice(0, -5),
                    amount: 495.00,
                    taxPercentage: 1,
                    tax: 5,
                    total: 500,
                    stamp: new Date(),
                    status: TransactionStatus.Finished,
                    terminalId: terminal_01.terminalId,
                });
        
                transaction_02.orderRequestData = '{""method"":""POST"",""maxBodyLength"":null,""url"":""https://api.mercadopago.com/instore/orders/qr/seller/collectors/1713092135/pos/99988/qrs"",""headers"":{""Content-Type"":""application/json"",""Authorization"":""Bearer APP_USR-6407024715531601-030609-c9114c3665d2c6cc85a26704d5cb545f-1713092135""},""data"":""{\""external_reference\"":\""6ea89621-1bfc-44b1-aee7-5edde9cc42d7\"",\""total_amount\"":990,\""title\"":\""Carga\"",\""description\"":\""Carga\"",\""items\"":[{\""title\"":\""Ticket\"",\""description\"":\""Ticket\"",\""quantity\"":1,\""unit_measure\"":\""unit\"",\""unit_price\"":990,\""total_amount\"":990}],\""notification_url\"":\""https://4720-2803-9800-b0f6-76-2866-e6c1-2ee5-9624.ngrok-free.app/api/transaction/ReceiveNotifications\""}""}';
                transaction_02.orderResponseData = '{""in_store_order_id"":""dbf5b887-6ffe-4d5d-87a0-ac9ba150dfe0"",""qr_data"":""00020101021243650016com.mercadolibre020130636dbf5b887-6ffe-4d5d-87a0-ac9ba150dfe05011000711111115204970053030325802AR5909Test Test6004CABA6304C456""}';
                transaction_02.merchantOrderData = '{""id"":19236333916,""status"":""closed"",""external_reference"":""6ea89621-1bfc-44b1-aee7-5edde9cc42d7"",""preference_id"":""1713092135-8ea622b5-cbc6-44f4-b11c-14eba889fafc"",""payments"":[{""id"":79248302605,""transaction_amount"":990,""total_paid_amount"":990,""shipping_cost"":0,""currency_id"":""ARS"",""status"":""approved"",""status_detail"":""accredited"",""operation_type"":""regular_payment"",""date_approved"":""2024-05-31T15:22:31.000-04:00"",""date_created"":""2024-05-31T15:22:30.000-04:00"",""last_modified"":""2024-05-31T15:22:31.000-04:00"",""amount_refunded"":0}],""shipments"":[],""payouts"":[],""collector"":{""id"":1713092135,""email"":"""",""nickname"":""TESTUSER477029465""},""marketplace"":""NONE"",""notification_url"":""https://4720-2803-9800-b0f6-76-2866-e6c1-2ee5-9624.ngrok-free.app/api/transaction/ReceiveNotifications"",""date_created"":""2024-05-31T15:22:20.980-04:00"",""last_updated"":""2024-05-31T15:22:31.254-04:00"",""sponsor_id"":null,""shipping_cost"":0,""total_amount"":990,""site_id"":""MLA"",""paid_amount"":990,""refunded_amount"":0,""payer"":{""id"":1712072899,""email"":""""},""items"":[{""id"":"""",""category_id"":"""",""currency_id"":""ARS"",""description"":""Ticket"",""picture_url"":null,""title"":""Ticket"",""quantity"":1,""unit_price"":990}],""cancelled"":false,""additional_info"":"""",""application_id"":null,""is_test"":false,""order_status"":""paid"",""client_id"":""6407024715531601""}';
                transaction_02.paymentData = '{""accounts_info"":null,""acquirer_reconciliation"":[],""additional_info"":{""authentication_code"":null,""available_balance"":null,""nsu_processadora"":null},""authorization_code"":null,""binary_mode"":true,""brand_id"":null,""build_version"":""3.53.0"",""call_for_authorize_id"":null,""captured"":true,""card"":{},""charges_details"":[{""accounts"":{""from"":""collector"",""to"":""mp""},""amounts"":{""original"":9.6,""refunded"":0},""client_id"":0,""date_created"":""2024-05-31T15:22:30.000-04:00"",""id"":""79248302605-001"",""last_updated"":""2024-05-31T15:22:30.000-04:00"",""metadata"":{},""name"":""mercadopago_fee"",""refund_charges"":[],""reserve_id"":null,""type"":""fee""},{""accounts"":{""from"":""collector"",""to"":""mp""},""amounts"":{""original"":29.7,""refunded"":0},""client_id"":0,""date_created"":""2024-05-31T15:22:30.000-04:00"",""id"":""79248302605-002"",""last_updated"":""2024-05-31T15:22:30.000-04:00"",""metadata"":{""mov_detail"":""tax_withholding_sirtac_noinsc"",""mov_financial_entity"":""buenos_aires"",""mov_type"":""expense"",""tax_id"":85201103304,""tax_status"":""applied"",""user_id"":1713092135},""name"":""tax_withholding_sirtac_noinsc-buenos_aires"",""refund_charges"":[],""reserve_id"":null,""type"":""tax""}],""collector_id"":1713092135,""corporation_id"":null,""counter_currency"":null,""coupon_amount"":0,""currency_id"":""ARS"",""date_approved"":""2024-05-31T15:22:31.000-04:00"",""date_created"":""2024-05-31T15:22:30.000-04:00"",""date_last_updated"":""2024-05-31T15:22:32.000-04:00"",""date_of_expiration"":null,""deduction_schema"":null,""description"":""Carga"",""differential_pricing_id"":null,""external_reference"":""6ea89621-1bfc-44b1-aee7-5edde9cc42d7"",""fee_details"":[{""amount"":9.6,""fee_payer"":""collector"",""type"":""mercadopago_fee""}],""financing_group"":null,""id"":79248302605,""installments"":1,""integrator_id"":null,""issuer_id"":""2005"",""live_mode"":true,""marketplace_owner"":null,""merchant_account_id"":null,""merchant_number"":null,""metadata"":{},""money_release_date"":""2024-05-31T15:22:31.000-04:00"",""money_release_schema"":null,""money_release_status"":""released"",""notification_url"":""https://4720-2803-9800-b0f6-76-2866-e6c1-2ee5-9624.ngrok-free.app/api/transaction/ReceiveNotifications"",""operation_type"":""regular_payment"",""order"":{""id"":""19236333916"",""type"":""mercadopago""},""payer"":{""id"":""1712072899""},""payment_method"":{""id"":""account_money"",""issuer_id"":""2005"",""type"":""account_money""},""payment_method_id"":""account_money"",""payment_type_id"":""account_money"",""platform_id"":null,""point_of_interaction"":{""application_data"":{""name"":null,""version"":null},""business_info"":{""branch"":""QR"",""sub_unit"":""qr"",""unit"":""wallet""},""location"":{""source"":""store"",""state_id"":""AR-B""},""transaction_data"":{""bank_info"":{""collector"":{""account_holder_name"":null,""account_id"":null,""long_name"":null,""transfer_account_id"":null},""is_same_bank_account_owner"":null,""origin_bank_id"":null,""origin_wallet_id"":null,""payer"":{""account_id"":null,""external_account_id"":null,""id"":null,""identification"":{},""long_name"":null}},""bank_transfer_id"":null,""e2e_id"":null,""financial_institution"":null,""infringement_notification"":{""status"":null,""type"":null},""qr_code"":null,""ticket_url"":null,""transaction_id"":null},""type"":""INSTORE""},""pos_id"":""98070069"",""processing_mode"":""aggregator"",""refunds"":[],""shipping_amount"":0,""sponsor_id"":null,""statement_descriptor"":null,""status"":""approved"",""status_detail"":""accredited"",""store_id"":""60512938"",""tags"":null,""taxes_amount"":0,""transaction_amount"":990,""transaction_amount_refunded"":0,""transaction_details"":{""acquirer_reference"":null,""bank_transfer_id"":null,""external_resource_url"":null,""financial_institution"":null,""installment_amount"":0,""net_received_amount"":950.7,""overpaid_amount"":0,""payable_deferral_period"":null,""payment_method_reference_id"":null,""total_paid_amount"":990,""transaction_id"":null}}';
                this.transactionService.internalSave(transaction_02);
        
                await this.transactionLogService.create({
                    transactionLogId: '',
                    description: 'Nueva transacción',
                    data: '-',
                    step: TransactionStep.New,
                    stamp: new Date(),
                    transactionId: transaction_02.transactionId
                });
                await this.transactionLogService.create({
                    transactionLogId: '',
                    description: 'Enviar la transacción a MercadoPago',
                    data: '-',
                    step: TransactionStep.SendToMP,
                    stamp: new Date(),
                    transactionId: transaction_02.transactionId
                });
                await this.transactionLogService.create({
                    transactionLogId: '',
                    description: 'Recibir la transacción de MercadoPago',
                    data: '-',
                    step: TransactionStep.ReceiveFromMP,
                    stamp: new Date(),
                    transactionId: transaction_02.transactionId
                });
                await this.transactionLogService.create({
                    transactionLogId: '',
                    description: 'ReceiveMerchantOrder',
                    data: '-',
                    step: TransactionStep.ReceiveMerchantOrder,
                    stamp: new Date(),
                    transactionId: transaction_02.transactionId
                });
                await this.transactionLogService.create({
                    transactionLogId: '',
                    description: 'ReceivePayment',
                    data: '-',
                    step: TransactionStep.ReceivePayment,
                    stamp: new Date(),
                    transactionId: transaction_02.transactionId
                });
                await this.transactionLogService.create({
                    transactionLogId: '',
                    description: 'Imprimir el ticket',
                    data: '-',
                    step: TransactionStep.PrintTicket,
                    stamp: new Date(),
                    transactionId: transaction_02.transactionId
                });
                await this.transactionLogService.create({
                    transactionLogId: '',
                    description: 'Enviar la transacción al cajero',
                    data: '-',
                    step: TransactionStep.SendToCashier,
                    stamp: new Date(),
                    transactionId: transaction_02.transactionId
                });
                await this.transactionLogService.create({
                    transactionLogId: '',
                    description: 'Enviar la transacción al cajero',
                    data: '-',
                    step: TransactionStep.ReceiveFromCashier,
                    stamp: new Date(),
                    transactionId: transaction_02.transactionId
                });
                await this.transactionLogService.create({
                    transactionLogId: '',
                    description: '"Imprimir el ticket TITO"',
                    data: '-',
                    step: TransactionStep.PrintTITO,
                    stamp: new Date(),
                    transactionId: transaction_02.transactionId
                });
        
                */

        /*
         await this.transactionLogService.create({
             transactionLogId: '',
             description: 'Transacción Registrada - TITO 1354322 ($100.00)',
             data: '{"transactionId": "1354322", "amount": 100.00, "tax": 0.29, "total": 99.71, "status": "Finished"}',
             step: TransactionStep.New,
             stamp: new Date(),
             transactionId: transaction_01.transactionId
         });
         */
    }


    async processMigrationFile(filePath: string): Promise<void> {
        try {
          const fileContent = await fs.readFile(filePath, 'utf-8');
          const migrationName = this.extractMigrationName(fileContent);
    
          if (!migrationName) {
            throw new NotFoundException('Migration name not found in the file.');
          }
    
          const upQueries = this.extractQueries(fileContent, 'up', 'down');
          const downQueries = this.extractQueries(fileContent, 'down');
    
          const upFileName = this.modifyFileName(filePath, '_up.sql');
          const downFileName = this.modifyFileName(filePath, '_down.sql');
    
          const upFileContent = upQueries.join(';\n') + ';';
          const downFileContent = downQueries.join(';\n') + ';';
    
          // Crear la transacción SQL
          const timestamp = Number(migrationName.match(/\d+$/)[0]);
          const transactionQueries = `
          BEGIN;
    
          CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    
          -- Crear la tabla migrations si no existe
          DO $$
          BEGIN
              IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'migrations') THEN
                  CREATE TABLE migrations (
                      id SERIAL PRIMARY KEY,
                      timestamp BIGINT NOT NULL,
                      name VARCHAR(255) NOT NULL
                  );
              END IF;
          END $$;
    
          -- Verificar si la migración ya existe
          DO $$
          BEGIN
              IF NOT EXISTS (SELECT 1 FROM migrations WHERE name = '${migrationName}') THEN
                  -- Insertar la migración en la tabla
                  INSERT INTO migrations ("timestamp", "name") VALUES (${timestamp}, '${migrationName}');
                 
                  ${upFileContent}
              END IF;
          END $$;
    
          COMMIT;
          `;
    
          await fs.writeFile(upFileName, transactionQueries, 'utf-8');
          await fs.writeFile(downFileName, downFileContent, 'utf-8');
    
          // Borrar el archivo original
          await fs.unlink(filePath);
    
          console.log('Files processed and created:', upFileName, downFileName);
        } catch (ex) {
          throw new NotFoundException('Error processing file:', ex);
        }
      }
    
      private extractMigrationName(fileContent: string): string | null {
        const nameRegex = /export class (\w+) implements MigrationInterface/;
        const nameMatch = nameRegex.exec(fileContent);
        return nameMatch ? nameMatch[1] : null;
      }
    
      private extractQueries(fileContent: string, method: string, nextMethod?: string): string[] {
        // const methodRegex = new RegExp(`${method}\\(queryRunner: QueryRunner\\): Promise<void> {([\\s\\S]*?)}\\n\\s*}`, 'gm');
        // const methodMatch = methodRegex.exec(fileContent);
        // console.log(methodMatch);

        const methodRegex = new RegExp(`${method}\\(queryRunner: QueryRunner\\): Promise<void> {([\\s\\S]*?)}\\s*}`, 'gm');
        const methodMatch = methodRegex.exec(fileContent);
        console.log(`Method match for ${method}:`, methodMatch); // Log the match result for debugging
        if (!methodMatch) return [];

        if (!methodMatch) return [];
    
        let queriesBlock = methodMatch[1];
    
        if (nextMethod) {
          const nextMethodRegex = new RegExp(`${nextMethod}\\(queryRunner: QueryRunner\\): Promise<void>`, 'gm');
          const nextMethodMatch = nextMethodRegex.exec(fileContent);
          if (nextMethodMatch) {
            queriesBlock = queriesBlock.slice(0, nextMethodMatch.index);
          }
        }
    
        const queryRegex = /await queryRunner\.query\s*\(\s*`([\s\S]*?)`\s*\)\s*;/g;
        const queries = [];
        let queryMatch;
        while ((queryMatch = queryRegex.exec(queriesBlock)) !== null) {
          queries.push(queryMatch[1].trim());
        }
        return queries;
      }
    
      private modifyFileName(filePath: string, suffix: string): string {
        const { dir, name } = path.parse(filePath);
        return path.join(dir, `${name}${suffix}`);
      }
}