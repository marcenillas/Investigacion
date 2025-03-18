import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ConfigRoutingModule } from './config.routing';
import { ConfigPageComponent } from './pages/config-page/config-page.component';
import { ConfigFormPageComponent } from './pages/config-form-page/config-form-page.component';
import { ConfigLayoutPageComponent } from './pages/config-layout-page/config-layout-page.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        SharedModule,
        ConfigRoutingModule
    ],
    exports: [
        ConfigPageComponent,
        ConfigFormPageComponent
    ],
    declarations: [
        ConfigPageComponent,
        ConfigFormPageComponent,
        ConfigLayoutPageComponent
    ]
})
export class ConfigModule { }