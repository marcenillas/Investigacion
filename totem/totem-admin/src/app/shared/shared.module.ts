import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AccountComponent } from './components/account/account.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LoadingComponent } from './components/loading/loading.component';
import { ToastComponent } from './components/toast/toast.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';
import { BooleanToYesNo, DefaultJsonString, DefaultString, DefaultStringForDate, DefaultStringForDecimalNumbers, DefaultCeroForDecimalNumbers, DefaultStringForNumbers, EnumToArrayPipe } from './shared.pipes';

@NgModule({
    declarations: [
        AccountComponent,
        NavbarComponent,
        FooterComponent,
        LoadingComponent,
        ToastComponent,
        ConfirmModalComponent,
        DefaultString,
        DefaultStringForDate,
        DefaultStringForNumbers,
        DefaultStringForDecimalNumbers,
        DefaultCeroForDecimalNumbers,
        EnumToArrayPipe,
        BooleanToYesNo,
        DefaultJsonString

    ],
    imports: [
        CommonModule,
        RouterModule,
    ],
    exports: [
        NavbarComponent,
        FooterComponent,
        LoadingComponent,
        ToastComponent,
        ConfirmModalComponent,

        // Pipes
        DefaultString,
        DefaultStringForDate,
        DefaultStringForNumbers,
        DefaultStringForDecimalNumbers,
        DefaultCeroForDecimalNumbers,
        EnumToArrayPipe,
        BooleanToYesNo,
        DefaultJsonString    ]
})
export class SharedModule { }