import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';
import { HomeLayoutPageComponent } from './pages/home-layout-page/home-layout-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HomeRoutingModule } from './home.routing';

import { TerminalModule } from '../terminal/terminal.module';
import { TerminalListComponent } from '../terminal/components/terminal-list/terminal-list.component';

import { TransactionModule } from '../transaction/transaction.module';
import { TransactionListComponent } from '../transaction/components/transaction-list/transaction-list.component';

import { EventModule } from '../event/event.module';
import { EventListComponent } from '../event/components/event-list/event-list.component';

import { OperatorLogModule } from '../operatorLog/operatorLog.module';
import { OperatorLogListComponent } from '../operatorLog/components/operatorLog-list/operatorLog-list.component';


@NgModule({
    declarations: [
        HomeLayoutPageComponent,
        HomePageComponent,
        TerminalListComponent,
        TransactionListComponent,        
        EventListComponent,
        OperatorLogListComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HomeRoutingModule,
        SharedModule,
        TerminalModule,
        TransactionModule,
        EventModule,
        OperatorLogModule
    ],
})
export class HomeModule { }