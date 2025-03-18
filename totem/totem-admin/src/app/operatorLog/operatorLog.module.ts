import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { TerminalModule } from '../terminal/terminal.module';
import {  OperatorActionDescription,
        OperatorActionClassBorder,
        OperatorActionClassText,   
        OperatorActionClassBg, 
        OperatorActionClassTextBg,
        OperatorActionClassBtn } from './operatorLog.pipes';
import { OperatorLogFilterComponent } from './components/operatorLog-filter/operatorLog-filter.component';
import { OperatorLogGridComponent } from './components/operatorLog-grid/operatorLog-grid.component';
import { OperatorLogHomePageComponent } from './pages/operatorLog-home-page/operatorLog-home-page.component';
import { OperatorLogRoutingModule } from './operatorLog.routing';
import { OperatorLogLayoutPageComponent } from './pages/operatorLog-layout-page/operatorLog-layout-page.component';
import { OperatorLogPageComponent } from './pages/operatorLog-page/operatorLog-page.component';


@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        SharedModule,
        OperatorLogRoutingModule,
        TerminalModule
    ],
    declarations: [
        OperatorLogLayoutPageComponent,
        OperatorLogHomePageComponent,
        OperatorLogPageComponent,
        OperatorLogFilterComponent,
        OperatorLogGridComponent,
  
        // Pipes
        OperatorActionDescription,
        OperatorActionClassBorder,
        OperatorActionClassText,   
        OperatorActionClassBg, 
        OperatorActionClassTextBg,
        OperatorActionClassBtn
    ],
    exports: [
        OperatorActionDescription,
        OperatorActionClassBorder,
        OperatorActionClassText,  
        OperatorActionClassBg,
        OperatorActionClassTextBg,
        OperatorActionClassBtn
    ]
})
export class OperatorLogModule { }