/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EventHomePageComponent } from './event-home-page.component';

describe('EventHomePageComponent', () => {
	let component: EventHomePageComponent;
	let fixture: ComponentFixture<EventHomePageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EventHomePageComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EventHomePageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
