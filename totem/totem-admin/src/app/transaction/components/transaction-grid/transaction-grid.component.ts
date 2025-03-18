import { Component, Input, ViewChild } from '@angular/core';
import { Transaction, Status, Filter } from '../../transaction.interfaces';
import { Terminal } from '../../../terminal/terminal.interfaces';
import { TransactionService } from '../../transaction.service';
import { TransactionFilterComponent } from '../transaction-filter/transaction-filter.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ConfigService } from '../../../config/config.service';
import { Config } from '../../../config/config.interfaces';

@Component({
    selector: 'transaction-grid',
    templateUrl: './transaction-grid.component.html',
    styleUrls: ['./transaction-grid.component.css']
})
export class TransactionGridComponent {

    @ViewChild(TransactionFilterComponent) transactionFilterComponent!: TransactionFilterComponent;
    public loading = false;
    public showModalWindow: boolean = false;
    public form: FormGroup;

    @Input()
    public transactionList: Transaction[] = [{
        transactionId: 0,
        status: Status.New,
        description: '...',
        stamp: new Date(),
        terminalId: 0,
        terminal: {
            terminalId: '...',
            name: '...'
        },
        amount: 0,
        taxPercentage: 0,
        tax: 0,
        total: 0,
        
        orderRequestData:'',
        orderResponseData:'',
        merchantOrderData :'',
        paymentData:'',   
        paymentMethod : '',
        paymentId: '',
        paymentUser: '',

        feeBorneClientCharge:false,
        mpFee:0,
        mpTax:0,
        mptotal:0

    }];

    @Input()
    public dataCount: number = 0;

    @Input()
    public currentPage: number = 1;

    @Input()
    public itemsPerPage: number = 50;

    @Input()
    public itemsPerPageOptions: number[] = [10, 20, 50, 100];

    @Input()
    public visiblePages: number[] = [];

    private maxVisiblePages: number = 3;

    private halfMaxVisiblePages: number = Math.floor(this.maxVisiblePages / 2);


    private currentFilter?: Filter | null;


    get totalPages(): number {
        var a = Math.ceil(this.dataCount / this.itemsPerPage);
        return a;
    }

    get totalPagesArray(): number[] {
        return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    get AddPoints(): boolean {
        var a = false;
        if (this.totalPages > this.maxVisiblePages)
            a = this.currentPage + this.halfMaxVisiblePages < this.totalPages;
        return a
    }

    public config?: Config;

    constructor(
        private transactionService: TransactionService,
        private configService: ConfigService
    ) {

        this.configService.getAll()
            .subscribe(config => {
                this.config = config[0];
            });

        const fb = new FormBuilder();
        this.form = fb.group({
            itemsPerPage: 50
        });



    }

    showModal() { this.showModalWindow = true; }

    ngOnInit(): void {
        this.loadPage(this.currentPage);
    }

    loadPage(page: number): void {
        if (this.currentFilter) {
            this.currentFilter.offset = page - 1;
            this.currentFilter.limit = this.itemsPerPage;
            this.getTransactionData(this.currentFilter, page);
          } else {
            this.getTransactionData(null, page);
          }       
    }



     getTransactionData(filter: any, page: number): void {
        const observable = filter
          ? this.transactionService.getByFilter(filter)
          : this.transactionService.getAll({ offset: page - 1, limit: this.itemsPerPage });
      
        observable.subscribe(rowsd => {
            this.transactionList = rowsd.data.map(transaction => {
                try {                   
                    const data =    JSON.parse(transaction.merchantOrderData)   ;
                    const paymentId = data?.payments[0]?.id || '-'; 
                    const paymentUser = data?.payer?.id|| '-';                     
                    const updatedTransaction: Transaction = {
                      ...transaction,
                      paymentId,
                      paymentUser
                    };                
                    return updatedTransaction;
                  } catch (error) {
                    console.error(`Error al analizar merchanData en la transacción ${transaction.transactionId}:`, error);                           
                    return { ...transaction, paymentId: '-' };
                  }
                });
      
          this.dataCount = rowsd.count;
          this.maxVisiblePages = Math.min(Math.ceil(this.dataCount / this.itemsPerPage), 3);
          this.updateVisiblePages();
        });
      }





    changePage(page: number): void {
        this.currentPage = page;
        this.loadPage(page);
    }


    updateVisiblePages(): void {

        if (this.currentPage <= this.halfMaxVisiblePages) {
            this.visiblePages = Array.from({ length: this.maxVisiblePages }, (_, i) => i + 1);
        } else if (this.currentPage >= this.totalPages - this.halfMaxVisiblePages) {
            this.visiblePages = Array.from({ length: this.maxVisiblePages }, (_, i) => this.totalPages - this.maxVisiblePages + i + 1);
        } else {
            this.visiblePages = Array.from({ length: this.maxVisiblePages }, (_, i) => this.currentPage - this.halfMaxVisiblePages + i);
        }
    }


    updateItemsPerPage(item: any): void {
        let val = item.target.value
        if (val) {

            this.itemsPerPage = val;
            this.changePage(1);
        }
    }

    onConfirm(values: Filter | undefined) {
        console.log(values, 'confirm');
        this.showModalWindow = false;
        this.currentFilter = values as Filter;
        this.changePage(1);

    }

    onCancel() { this.showModalWindow = false; }

    resetFilter() {

        if (this.transactionFilterComponent && this.transactionFilterComponent.form) {
            const fakeChangeEvent = {
                target: { checked: true }
            };

            this.transactionFilterComponent.initDate()
            this.transactionFilterComponent.onCheckboxTerminalAllChange(fakeChangeEvent);
            this.transactionFilterComponent.onCheckboxStatusAllChange(fakeChangeEvent);

            this.currentFilter = null;
            this.changePage(1);
        }
    }

    refresh() {
        this.changePage(this.currentPage);
    }
}