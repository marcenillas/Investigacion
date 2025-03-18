/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserFormPageComponent } from './user-form-page.component';

describe('UserFormPageComponent', () => {
	let component: UserFormPageComponent;
	let fixture: ComponentFixture<UserFormPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UserFormPageComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserFormPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
