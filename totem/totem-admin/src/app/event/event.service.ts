import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

import { Event, Filter } from './event.interfaces';
import { environment } from './../../environments/environment';
import { PaginationDTO } from '../../../../sielcon-pay-backend/src/common/dtos/pagination.data';
import { map } from 'rxjs/operators'
import { ConfigJsonService } from '../services/configJson.service';

@Injectable({ providedIn: 'root' })
export class EventService {

    private http = inject(HttpClient);

    constructor(private configService: ConfigJsonService) { }

    getAll(p?: PaginationDTO): Observable<{ data: Event[]; count: number }> {
        const url = p ? `${this.configService.baseUrl}/event?limit=${p.limit}&offset=${p.offset}` : `${this.configService.baseUrl}/event`;

        return this.http.get<{ data: Event[]; count: number }>(url).pipe(
            map(response => {
                response.data = this.processEvents(response.data);
                return response;
            })
        );
    }


    getById(id: string): Observable<Event | undefined> {
        const url = `${this.configService.baseUrl}/event/${id}`;

        return this.http.get<Event>(url).pipe(
          map(event => this.processEvents([event])[0])
        );
    }

    getByQuery(query: string): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.configService.baseUrl}/event?q=${query}`).pipe(
            map(response => {
                response = this.processEvents(response);
                return response;
            })
        );
    }

    getByFilter(filter: Filter): Observable<{ data: Event[]; count: number }> {

        return this.http.post<{ data: Event[]; count: number }>(`${this.configService.baseUrl}/Event/EventByFilter`, filter).pipe(
            map(response => {
                response.data = this.processEvents(response.data);
                return response;
            })
        );


    }

    private processEvents(events: Event[]): Event[] {
        return events.map(event => {
            const parts = event.description.split(':');
            if (parts.length === 2) {
                event.origin = parts[0];
                event.state = parts[1];
            }
            return event;
        });
    }
}