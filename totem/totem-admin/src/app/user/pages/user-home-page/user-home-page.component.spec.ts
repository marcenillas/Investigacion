/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserHomePageComponent } from './user-home-page.component';

describe('UserHomePageComponent', () => {
	let component: UserHomePageComponent;
	let fixture: ComponentFixture<UserHomePageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [UserHomePageComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserHomePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
