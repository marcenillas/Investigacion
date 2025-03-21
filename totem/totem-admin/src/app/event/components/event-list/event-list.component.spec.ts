/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EventListComponent } from './event-list.component';

describe('EventComponent', () => {
	let component: EventListComponent;
	let fixture: ComponentFixture<EventListComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EventListComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EventListComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
