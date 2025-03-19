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
import { logoMP, logoBranch, logoCompany, c1, c2, c3, c4, c5 } from './imageData';
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
        c.logoBranchImage = "logoBranch.png"
        c.logoCompanyImage = "logoCompany.png"
        c.logoMPImageData = Buffer.from(logoMP, 'hex');
        c.logoBranchImageData = Buffer.from(logoBranch, 'hex');;
        c.logoCompanyImageData = Buffer.from(logoCompany, 'hex');;
        this.configurationService.internalSave(c);

        const terminal_01 = await this.terminalService.create({
            terminalId: '',
            name: 'Terminal Planta Baja',
            description: 'Terminal ubicado en Planta Baja, habilitado sólo en horario diurno, modo QR Fijo y billetes de denominación general.',
            enabled: true, modeQR: true, modeFixed: false,
            status: TerminalStatus.Online,
            carrouselImage01: 'c1.png', carrouselImage02: 'c2.png', carrouselImage03: 'c3.png', carrouselImage04: 'c4.png', carrouselImage05: 'c5.png',
            definedValues: '100 | 200 | 500 | 1000 | 2000 | 5000 | 10000 | 50000',
            storeId: '9998', posId: '99988', printVoucher: true, printTicket: true,
            printerTicketName: 'GP-80160(Cut) Series', printerVoucherCom: 'COM7',

        });

        terminal_01.carrouselImageData01 = Buffer.from(c1, 'hex');
        terminal_01.carrouselImageData02 = Buffer.from(c2, 'hex');
        terminal_01.carrouselImageData03 = Buffer.from(c3, 'hex');
        terminal_01.carrouselImageData04 = Buffer.from(c4, 'hex');
        terminal_01.carrouselImageData05 = Buffer.from(c5, 'hex');
        this.terminalService.internalSave(terminal_01);
      
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