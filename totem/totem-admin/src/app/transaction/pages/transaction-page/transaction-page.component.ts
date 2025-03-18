import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Transaction } from '../../transaction.interfaces';
import { TransactionLog } from '../../transaction.interfaces';
import { TransactionService } from '../../transaction.service';
import { Config } from '../../../config/config.interfaces';
import { ConfigService } from '../../../config/config.service';
import { TransactionInformationComponent } from '../../components/transaction-information/transaction-information.component';

@Component({
    selector: 'transaction-page',
    templateUrl: './transaction-page.component.html',
    styleUrls: ['./transaction-page.component.css']
})
export class TransactionPageComponent implements OnInit {

    @ViewChild(TransactionInformationComponent) transactionInformationComponent!: TransactionInformationComponent;

    public showModalWindow: boolean = false;

    public config?: Config;
    public transaction?: Transaction;
    public transactionLogList?: TransactionLog[];



    public activeTab: String

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private transactionService: TransactionService,
        private configService: ConfigService
    ) {

        this.activeTab = "requestOrder";
    }

    ngOnInit(): void {

        this.configService.getAll()
            .subscribe(config => {
                this.config = config[0];
            });

        this.activatedRoute.params
            .pipe(switchMap(({ id }) => this.transactionService.getById(id)))
            .subscribe(transaction => {
                if (!transaction) {
                    this.router.navigateByUrl('/home');
                } else {
                    this.transaction = transaction;
                    try {
                        const data = JSON.parse(transaction.merchantOrderData);
                        this.transaction.paymentId = data?.payments[0]?.id || '-';
                        this.transaction.paymentUser = data?.payer?.id || '-';
                    }
                    catch {
                        this.transaction.paymentId = '-';
                        this.transaction.paymentUser = '-';
                    }

                }
            });

        this.activatedRoute.params
            .pipe(switchMap(({ id }) => this.transactionService.getLogById(id)))
            .subscribe(transactionLogList => {
                if (transactionLogList) {
                    this.transactionLogList = transactionLogList.map(item => {

                        try {
                            const info = JSON.parse(item.data)?.info || '-'; // Si es null, muestra un guion
                            const updateditem: TransactionLog = {
                                ...item,
                                info
                            };
                            return updateditem;
                        } catch (error) {
                            console.error(`Error al obtener datos ${item.description}:`, error);
                            return { ...item, info: '-' };
                        }
                    });



                };
            });
    }

    changeTab(activeTab: string, $event: MouseEvent): void {
        $event.preventDefault();
        this.activeTab = activeTab;
    }

    showInformation(data: string) {
        this.transactionInformationComponent.informationmsg = data;
        this.showModalWindow = true;
    }

    onCancel() { this.showModalWindow = false; }


}