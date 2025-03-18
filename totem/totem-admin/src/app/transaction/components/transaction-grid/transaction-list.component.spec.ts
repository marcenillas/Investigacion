/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TransactionGridComponent } from './transaction-grid.component';

describe('TransactionComponent', () => {
	let component: TransactionGridComponent;
	let fixture: ComponentFixture<TransactionGridComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TransactionGridComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TransactionGridComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
