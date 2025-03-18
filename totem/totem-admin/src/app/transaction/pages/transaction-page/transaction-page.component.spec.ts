/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TransactionPageComponent } from './transaction-page.component';

describe('TransactionPageComponent', () => {
	let component: TransactionPageComponent;
	let fixture: ComponentFixture<TransactionPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TransactionPageComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TransactionPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
