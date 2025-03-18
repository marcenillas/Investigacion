import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { Event } from '../../event.interfaces';
import { EventService } from '../../event.service';

@Component({
    selector: 'event-page',
    templateUrl: './event-page.component.html',
    styleUrls: ['./event-page.component.css']
})
export class EventPageComponent implements OnInit {

    public event?: Event;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private eventService: EventService,
    ) { }

    ngOnInit(): void {
        this.activatedRoute.params
            .pipe(switchMap(({ id }) => this.eventService.getById(id)))
            .subscribe(event => {
                if (!event) {
                    this.router.navigateByUrl('/home');
                } else {
                    this.event = event;
                }
            });
    }
}