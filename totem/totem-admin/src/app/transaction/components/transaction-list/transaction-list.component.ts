import { Component, Input } from '@angular/core';
import { Transaction, Status } from '../../transaction.interfaces';

@Component({
    selector: 'transaction-list',
    templateUrl: './transaction-list.component.html',
    styleUrls: ['./transaction-list.component.css']
})
export class TransactionListComponent {

    public statusEnum = Status;

    @Input()
    public transactionList: Transaction[] = [{
        transactionId: 0,
        status: Status.New,      
        description: '...',
        stamp: new Date(),
        terminalId: 0,
        terminal:
        {
            terminalId:"...",
            name:"..."
        },
        amount: 0,
        taxPercentage : 0,
        tax: 0,
        total: 0,
      
        orderRequestData:'',
        orderResponseData:'',
        merchantOrderData :'',
        paymentData:'',   

        paymentId : '',
        paymentUser: '',
        paymentMethod: '',
        feeBorneClientCharge:false,
        mpFee:0,
        mpTax:0,
        mptotal:0
    }];
}