import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionPageComponent } from './pages/transaction-page/transaction-page.component';
import { TransactionLayoutPageComponent } from './pages/transaction-layout-page/transaction-layout-page.component';
import { TransactionHomePageComponent } from './pages/transaction-home-page/transaction-home-page.component';

const routes: Routes = [
    {
        path: '',
        component: TransactionLayoutPageComponent,
        children: [
            { path: '', component: TransactionHomePageComponent },
            { path: ':id', component: TransactionPageComponent },
            { path: '**', redirectTo: '' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TransactionRoutingModule { }
