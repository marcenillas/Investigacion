import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { EventLayoutPageComponent } from './pages/event-layout-page/event-layout-page.component';
import { EventHomePageComponent } from './pages/event-home-page/event-home-page.component';

const routes: Routes = [
    {
        path: '',
        component: EventLayoutPageComponent,
        children: [
            { path: '', component: EventHomePageComponent },
            { path: ':id', component: EventPageComponent },
            { path: '**', redirectTo: '' }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class EventRoutingModule { }
