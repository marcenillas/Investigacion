/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EventPageComponent } from './event-page.component';

describe('EventPageComponent', () => {
	let component: EventPageComponent;
	let fixture: ComponentFixture<EventPageComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EventPageComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EventPageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
