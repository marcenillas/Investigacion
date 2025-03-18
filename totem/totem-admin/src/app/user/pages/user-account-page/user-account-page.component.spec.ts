/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserAccountPageComponent } from './user-account-page.component';

describe('UserAccountPageComponent', () => {
	let component: UserAccountPageComponent;
	let fixture: ComponentFixture<UserAccountPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UserAccountPageComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserAccountPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
