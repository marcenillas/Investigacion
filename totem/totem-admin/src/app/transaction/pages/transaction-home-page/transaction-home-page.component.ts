import { Component, OnInit } from '@angular/core';

import { Transaction } from '../../../transaction/transaction.interfaces';

import { TransactionService } from '../../../transaction/transaction.service';

@Component({
    selector: 'transaction-home-page',
    templateUrl: './transaction-home-page.component.html',
    styleUrls: ['./transaction-home-page.component.css']
})
export class TransactionHomePageComponent implements OnInit {

    public title = 'Totem Admin';

    public loading = true;

    public dataRows: Transaction[] = [];

    public dataCount:number = 0; 

    constructor(private transactionService: TransactionService) { }

    ngOnInit(): void {
        this.transactionService.getAll().subscribe(
            rowsd => {
                this.dataRows = rowsd.data;
                this.dataCount = rowsd.count 
                this.loading = false;
            });
    }
}