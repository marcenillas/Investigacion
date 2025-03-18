/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TransactionHomePageComponent } from './transaction-home-page.component';

describe('TransactionHomePageComponent', () => {
	let component: TransactionHomePageComponent;
	let fixture: ComponentFixture<TransactionHomePageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TransactionHomePageComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TransactionHomePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
