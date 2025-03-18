import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { TransactionRoutingModule } from './transaction.routing';
import { TransactionLayoutPageComponent } from './pages/transaction-layout-page/transaction-layout-page.component';
import { TransactionPageComponent } from './pages/transaction-page/transaction-page.component';
import { TransactionHomePageComponent } from './pages/transaction-home-page/transaction-home-page.component';
import { TransactionGridComponent } from './components/transaction-grid/transaction-grid.component';
import { StatusDescription, StatusClassBorder, StatusClassText, StatusClassBg, StatusClassTextBg, StatusClassBtn, PaymentMethodDescription } from './transaction.pipes';
import { TerminalModule } from '../terminal/terminal.module';
import { TransactionFilterComponent } from './components/transaction-filter/transaction-filter.component';
import { TransactionInformationComponent } from './components/transaction-information/transaction-information.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        SharedModule,
        TransactionRoutingModule,
        TerminalModule
    ],
    declarations: [
        TransactionLayoutPageComponent,
        TransactionHomePageComponent,
        TransactionPageComponent,        
        TransactionGridComponent,
        TransactionFilterComponent,

        // Pipes
        StatusDescription,
        StatusClassBorder,
        StatusClassText,
        StatusClassBg,
        StatusClassTextBg,
        StatusClassBtn,
        TransactionInformationComponent,
        PaymentMethodDescription
    ],
    exports: [
        StatusDescription,
        StatusClassBorder,
        StatusClassText,
        StatusClassBg,
        StatusClassTextBg,
        StatusClassBtn,
        PaymentMethodDescription
    ]
})
export class TransactionModule { }