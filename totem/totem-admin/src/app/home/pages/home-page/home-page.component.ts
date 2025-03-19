import { Component, OnInit, inject } from '@angular/core';

import { Terminal } from './../../../terminal/terminal.interfaces';
import { Transaction } from '../../../transaction/transaction.interfaces';
import { Event } from './../../../event/event.interfaces';
import { OperatorLog } from '../../../operatorLog/operatorLog.interfaces';

import { TerminalService } from './../../../terminal/terminal.service';
import { TransactionService } from './../../../transaction/transaction.service';
import { EventService } from './../../../event/event.service';
import { OperatorLogService } from '../../../operatorLog/operatorLog.service';


@Component({
    selector: 'home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {

    public title = 'Totem Admin';

    private terminalService = inject(TerminalService);
    private transactionService = inject(TransactionService);
    private eventService = inject(EventService);
    private operatorLogService = inject(OperatorLogService);

    public loadingTerminal = true;
    public loadingTransactions = true;
    public loadingEvents = true;
    public loadingOperatorLog = true;

    public dataRowsTerminal: Terminal[] = [];
    public dataRowsTransaction: Transaction[] = [];
    public dataRowsEvent: Event[] = [];
    public dataRowsOperatorLog: OperatorLog[] = [];

    ngOnInit(): void {
        this.terminalService.getAll({ limit: 10, offset: 0 }).subscribe(
            rows => {
                this.dataRowsTerminal = rows;
                this.loadingTerminal = false;
            });

        this.transactionService.getAll({ limit: 10, offset: 0 }).subscribe(
            rowsd => {
                this.dataRowsTransaction = rowsd.data;
                this.loadingTransactions = false;
            });

        this.eventService.getAll({ limit: 10, offset: 0 }).subscribe(
            rowsd => {
                this.dataRowsEvent = rowsd.data;
                this.loadingEvents = false;
            });        
        this.operatorLogService.getAll({ limit: 10, offset: 0 }).subscribe(          
            rowsd => {
                this.dataRowsOperatorLog = rowsd.data;
                this.loadingOperatorLog = false;               
            });
    }
}