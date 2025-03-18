import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeLayoutPageComponent } from './pages/home-layout-page/home-layout-page.component';
import { HomePageComponent } from './pages/home-page/home-page.component';

const routes: Routes = [
    {
        path: '',
        component: HomeLayoutPageComponent,
        children: [
            { path: '', component: HomePageComponent },
            { path: '**', redirectTo: '' },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
