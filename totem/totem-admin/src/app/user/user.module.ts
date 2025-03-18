import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../shared/shared.module';

import { UserRoutingModule } from './user.routing';
import { UserLayoutPageComponent } from './pages/user-layout-page/user-layout-page.component';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { UserFormPageComponent } from './pages/user-form-page/user-form-page.component';

import { UserListComponent } from './components/user-list/user-list.component';

import { EnabledClassBorder, EnabledClassTextBg, EnabledClassText } from './user.pipes';
import { UserHomePageComponent } from './pages/user-home-page/user-home-page.component';
import { UserAccountPageComponent } from './pages/user-account-page/user-account-page.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        SharedModule,
        UserRoutingModule
    ],
    exports: [
        
    ],
    declarations: [
        UserLayoutPageComponent,
        UserHomePageComponent,
        UserPageComponent,
        UserFormPageComponent,
        UserAccountPageComponent,
        UserListComponent,

        // Pipes
        EnabledClassBorder,
        EnabledClassTextBg,
        EnabledClassText
    ]
})
export class UserModule { }