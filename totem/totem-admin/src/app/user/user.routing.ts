import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserPageComponent } from './pages/user-page/user-page.component';
import { UserFormPageComponent } from './pages/user-form-page/user-form-page.component';
import { UserLayoutPageComponent } from './pages/user-layout-page/user-layout-page.component';
import { UserHomePageComponent } from './pages/user-home-page/user-home-page.component';
import { UserAccountPageComponent } from './pages/user-account-page/user-account-page.component';

const routes: Routes = [
    {
        path: '',
        component: UserLayoutPageComponent,
        children: [
            { path: '', component: UserHomePageComponent },
            { path: 'account', component: UserAccountPageComponent },
            { path: 'new', component: UserFormPageComponent },
            { path: 'edit/:id', component: UserFormPageComponent },
            { path: ':id', component: UserPageComponent },
            { path: '**', redirectTo: '' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UserRoutingModule { }