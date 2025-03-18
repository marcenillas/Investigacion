/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OperatorLogPageComponent } from './operatorLog-page.component';

describe('OperatorLogPageComponent', () => {
	let component: OperatorLogPageComponent;
	let fixture: ComponentFixture<OperatorLogPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OperatorLogPageComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OperatorLogPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
