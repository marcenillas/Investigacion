import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { Terminal } from './entities/terminal.entity';
import { Event } from './entities/event.entity';
import { Transaction } from './entities/transaction.entity';
import { Configuration } from './entities/configuration.entity';
import { TerminalService } from './services/terminal.service';
import { TerminalController } from './controllers/terminal.controller';
import { EventService } from './services/event.service';
import { EventController } from './controllers/event.controller';
import { TransactionController } from './controllers/transaction.controller';
import { TransactionService } from './services/transaction.service';
import { ConfigModule } from '@nestjs/config';
import { ImageService } from './services/image.service';
import { ImageController } from './controllers/image.controller';
import { ConfigurationController } from './controllers/configuration.controller';
import { ConfigurationService } from './services/configuration.service';
import { TransactionLog } from './entities/transactionLog.entity';
import { TransactionLogController } from './controllers/transactionLog.controller';
import { TransactionLogService } from './services/transactionLog.service';
import { SeedController } from './controllers/seed.controller';
import { SeedService } from './services/seed.service';
import { Cashierservice } from './services/cashier.service';
import { CashierController } from './controllers/cashier.controller';
import { OperatorLog } from './entities/operatorLog.entity';
import { OperatorLogController } from './controllers/operatorLog.controller';
import { OperatorLogService } from './services/operatorLog.service';
import { MPController } from './controllers/mp.controller';
import { MPservice } from './services/mp.service';

@Module({
    controllers: [
        ConfigurationController,
        EventController,
        ImageController,
        SeedController,
        TerminalController,
        TransactionController,
        TransactionLogController,
        CashierController,
        OperatorLogController,
        MPController
    ],
    providers: [
        ConfigurationService,
        EventService,
        ImageService,
        SeedService,
        TerminalService,
        TransactionService,
        TransactionLogService,
        Cashierservice,
        OperatorLogService,
        MPservice
    ],
    imports: [
        TypeOrmModule.forFeature([
            Configuration,
            Event,
            Terminal,
            Transaction,
            TransactionLog,
           OperatorLog,
        ]),
        ConfigModule
    ]
})
export class APIModule { }