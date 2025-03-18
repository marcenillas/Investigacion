import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

import { OperatorLog, Filter } from './operatorLog.interfaces';
import { environment } from './../../environments/environment';
import { PaginationDTO } from '../../../../sielcon-pay-backend/src/common/dtos/pagination.data';
import { ConfigJsonService } from '../services/configJson.service';

@Injectable({ providedIn: 'root' })
export class OperatorLogService {

    constructor(private configService: ConfigJsonService) { }

    private http = inject(HttpClient);

 
    getAll(p?: PaginationDTO): Observable<{ data: OperatorLog[]; count: number }> {
        const url = p ? `${this.configService.baseUrl}/OperatorLog?limit=${p.limit}&offset=${p.offset}` : `${this.configService.baseUrl}/OperatorLog`;       
        var a = this.http.get<{ data: OperatorLog[]; count: number }>(url);     
        return a
      }


    getById( id: string ): Observable<OperatorLog | undefined> {
        return this.http.get<OperatorLog>(`${ this.configService.baseUrl }/OperatorLog/${ id }`)
        .pipe(
            catchError( error => of(undefined) )
        );
    }

    getByQuery( query: string ): Observable<OperatorLog[]> {
        return this.http.get<OperatorLog[]>(`${ this.configService.baseUrl }/OperatorLog?q=${ query }`);
    }

    getByFilter(filter: Filter ):  Observable<{ data: OperatorLog[]; count: number }> {    
        return this.http.post<{ data: OperatorLog[]; count: number }>(`${ this.configService.baseUrl }/OperatorLog/OperatorLogByFilter`, filter);                 
    }
}