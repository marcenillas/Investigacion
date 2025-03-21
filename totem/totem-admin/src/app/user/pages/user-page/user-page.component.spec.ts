/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserPageComponent } from './user-page.component';

describe('UserPageComponent', () => {
	let component: UserPageComponent;
	let fixture: ComponentFixture<UserPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UserPageComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
