import { Component, Input } from '@angular/core';
import { Event, Type } from '../../event.interfaces';

@Component({
    selector: 'event-list',
    templateUrl: './event-list.component.html',
    styleUrls: ['./event-list.component.css']
})
export class EventListComponent {

    public typeEnum = Type;

    @Input()
    public eventList: Event[] = [{
        eventId: 0,
        type: Type.Info,
        name: '...',
        description: '...',
        stamp: new Date(),       
        terminalId: 0,
        terminal:
        {
            terminalId:"...",
            name:"..."
        },
        origin: '...',
        state: '...',
    }];
}