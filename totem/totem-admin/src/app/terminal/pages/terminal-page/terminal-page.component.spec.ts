/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TerminalPageComponent } from './terminal-page.component';

describe('TerminalPageComponent', () => {
	let component: TerminalPageComponent;
	let fixture: ComponentFixture<TerminalPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TerminalPageComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TerminalPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
