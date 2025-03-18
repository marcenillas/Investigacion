import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { SharedModule } from './shared/shared.module';
import { TerminalModule } from './terminal/terminal.module';
import { ConfigJsonService } from './services/configJson.service';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
		AppRoutingModule,
        SharedModule,
        TerminalModule
	],
	providers: [ ConfigJsonService,],
	bootstrap: [AppComponent]
})
export class AppModule { }