/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TerminalFormPageComponent } from '../../../terminal/pages/terminal-form-page/terminal-form-page.component';

describe('TerminalFormPageComponent', () => {
	let component: TerminalFormPageComponent;
	let fixture: ComponentFixture<TerminalFormPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TerminalFormPageComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TerminalFormPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
