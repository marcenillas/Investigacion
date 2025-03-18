import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { EventRoutingModule } from './event.routing';
import { EventLayoutPageComponent } from './pages/event-layout-page/event-layout-page.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { EventHomePageComponent } from './pages/event-home-page/event-home-page.component';
import { EventGridComponent } from './components/event-grid/event-grid.component';
import { TypeDescription, TypeClassBorder, TypeClassText, TypeClassBg, TypeClassTextBg, TypeClassBtn, OriginDescription } from './event.pipes';
import { TerminalModule } from '../terminal/terminal.module';
import { EventFilterComponent } from './components/event-filter/event-filter.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        SharedModule,
        EventRoutingModule,
        TerminalModule
    ],
    declarations: [
        EventLayoutPageComponent,
        EventHomePageComponent,
        EventPageComponent,        
        EventGridComponent,
        EventFilterComponent,

        // Pipes
        TypeDescription,
        TypeClassBorder,
        TypeClassText,
        TypeClassBg,
        TypeClassTextBg,
        TypeClassBtn,
        OriginDescription
    ],
    exports: [
        TypeDescription,
        TypeClassBorder,
        TypeClassText,
        TypeClassBg,
        TypeClassTextBg,
        TypeClassBtn,
        OriginDescription
    ]
})
export class EventModule { }