import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicGuard } from './auth/guards/public.guard';
import { PrivateGuard } from './auth/guards/private.guard';

const routes: Routes = [
    { path: 'auth', loadChildren: () => import('./auth/auth.module').then( m => m.AuthModule ), canActivate: [ PublicGuard ], canMatch: [ PublicGuard ] },
	{ path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomeModule ), canActivate: [ PrivateGuard ], canMatch: [ PrivateGuard ] },
    { path: 'terminal', loadChildren: () => import('./terminal/terminal.module').then( m => m.TerminalModule ), canActivate: [ PrivateGuard ], canMatch: [ PrivateGuard ] },
    { path: 'user', loadChildren: () => import('./user/user.module').then( m => m.UserModule ), canActivate: [ PrivateGuard ], canMatch: [ PrivateGuard ] },
	{ path: 'event', loadChildren: () => import('./event/event.module').then( m => m.EventModule ), canActivate: [ PrivateGuard ], canMatch: [ PrivateGuard ] },
    { path: 'transaction', loadChildren: () => import('./transaction/transaction.module').then( m => m.TransactionModule ), canActivate: [ PrivateGuard ], canMatch: [ PrivateGuard ] },
    { path: 'config', loadChildren: () => import('./config/config.module').then( m => m.ConfigModule ), canActivate: [ PrivateGuard ], canMatch: [ PrivateGuard ] },
    { path: 'operatorLog', loadChildren: () => import('./operatorLog/operatorLog.module').then( m => m.OperatorLogModule ), canActivate: [ PrivateGuard ], canMatch: [ PrivateGuard ] },
	{ path: '**', redirectTo: 'auth' }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }