import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConfigPageComponent } from './pages/config-page/config-page.component';
import { ConfigFormPageComponent } from './pages/config-form-page/config-form-page.component';
import { ConfigLayoutPageComponent } from './pages/config-layout-page/config-layout-page.component';

const routes: Routes = [
    {
        path: '',
        component: ConfigLayoutPageComponent,
        children: [
            { path: '', component: ConfigPageComponent },
            { path: 'edit', component: ConfigFormPageComponent },
            { path: '**', redirectTo: '' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ConfigRoutingModule { }