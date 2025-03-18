import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import {
    EnabledClassTextBg, 
    StatusClassBg, 
    StatusClassBorder, 
    StatusDescription,
    StatusClassText,
    StatusClassTextBg
} from './terminal.pipes';

import { TerminalRoutingModule } from './terminal.routing';
import { TerminalLayoutPageComponent } from './pages/terminal-layout-page/terminal-layout-page.component';
import { TerminalPageComponent } from './pages/terminal-page/terminal-page.component';
import { TerminalFormPageComponent } from './pages/terminal-form-page/terminal-form-page.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        SharedModule,
        TerminalRoutingModule
    ],
    declarations: [
        TerminalLayoutPageComponent,
        TerminalPageComponent,
        TerminalFormPageComponent,

        // Pipes
        StatusDescription,
        StatusClassBorder,
        StatusClassText,
        StatusClassBg,
        StatusClassTextBg,
        EnabledClassTextBg,
    ],
    exports: [
        StatusDescription,
        StatusClassBorder,
        StatusClassText,
        StatusClassBg,
        StatusClassTextBg,
        EnabledClassTextBg,
    ]
})
export class TerminalModule { }