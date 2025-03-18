/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { EventGridComponent } from './event-grid.component';

describe('EventComponent', () => {
	let component: EventGridComponent;
	let fixture: ComponentFixture<EventGridComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EventGridComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EventGridComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
