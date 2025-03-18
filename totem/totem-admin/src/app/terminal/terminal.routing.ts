import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TerminalPageComponent } from './pages/terminal-page/terminal-page.component';
import { TerminalFormPageComponent } from './pages/terminal-form-page/terminal-form-page.component';
import { TerminalLayoutPageComponent } from './pages/terminal-layout-page/terminal-layout-page.component';

const routes: Routes = [
    {
        path: '',
        component: TerminalLayoutPageComponent,
        children: [
            { path: 'new', component: TerminalFormPageComponent },
            { path: 'edit/:id', component: TerminalFormPageComponent },
            { path: ':id', component: TerminalPageComponent },
            { path: '**', redirectTo: 'list' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class TerminalRoutingModule { }
