import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OperatorLogLayoutPageComponent } from './pages/operatorLog-layout-page/operatorLog-layout-page.component';
import { OperatorLogPageComponent } from './pages/operatorLog-page/operatorLog-page.component';
import { OperatorLogHomePageComponent } from './pages/operatorLog-home-page/operatorLog-home-page.component';

const routes: Routes = [
    {
        path: '',
        component: OperatorLogLayoutPageComponent,
        children: [
            { path: '', component: OperatorLogHomePageComponent },
            { path: ':id', component: OperatorLogPageComponent },
            { path: '**', redirectTo: '' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OperatorLogRoutingModule { }
