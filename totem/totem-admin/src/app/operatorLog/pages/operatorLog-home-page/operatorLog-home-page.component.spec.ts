/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OperatorLogHomePageComponent } from './operatorLog-home-page.component';

describe('OperatorLogHomePageComponent', () => {
	let component: OperatorLogHomePageComponent;
	let fixture: ComponentFixture<OperatorLogHomePageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OperatorLogHomePageComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OperatorLogHomePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
