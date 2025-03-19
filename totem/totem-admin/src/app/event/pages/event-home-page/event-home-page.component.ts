import { Component, OnInit } from '@angular/core';

import { Event } from '../../../event/event.interfaces';

import { EventService } from '../../../event/event.service';

@Component({
    selector: 'event-home-page',
    templateUrl: './event-home-page.component.html',
    styleUrls: ['./event-home-page.component.css']
})
export class EventHomePageComponent implements OnInit {

    public title = 'Totem Admin';

    public loading = true;

    public dataRows: Event[] = [];

    public dataCount:number = 0; 


    constructor(
        private eventService: EventService
    ) { }

    ngOnInit(): void {
        this.eventService.getAll().subscribe(
            rowsd => {
                this.dataRows = rowsd.data;
                this.dataCount = rowsd.count;
                this.loading = false;
            });
    }
}