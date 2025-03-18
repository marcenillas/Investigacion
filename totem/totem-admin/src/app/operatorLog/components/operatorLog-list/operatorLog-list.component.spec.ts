/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { OperatorLogListComponent } from './operatorLog-list.component';

describe('OperatorLogComponent', () => {
	let component: OperatorLogListComponent;
	let fixture: ComponentFixture<OperatorLogListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [OperatorLogListComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OperatorLogListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
