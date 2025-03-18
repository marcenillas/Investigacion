import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { Terminal } from './terminal.interfaces';
import { environment } from '../../environments/environment';
import { PaginationDTO } from '../../../../sielcon-pay-backend/src/common/dtos/pagination.data';
import { ConfigJsonService } from '../services/configJson.service';

@Injectable({ providedIn: 'root' })
export class TerminalService {
    
    constructor(private configService: ConfigJsonService) { }
    
    private http = inject(HttpClient);

    getAll(p?: PaginationDTO):Observable<Terminal[]> {
        return !p ?
            this.http.get<Terminal[]>(`${ this.configService.baseUrl }/terminal`) : 
            this.http.get<Terminal[]>(`${ this.configService.baseUrl }/terminal?limit=${p?.limit}&offset=${p?.offset}`);
    }

    getById( id: string ): Observable<Terminal | undefined> {
        return this.http.get<Terminal>(`${ this.configService.baseUrl }/terminal/${ id }`)
        .pipe(catchError( error => of(undefined) ));
    }

    getByQuery( query: string ): Observable<Terminal[]> {
        return this.http.get<Terminal[]>(`${ this.configService.baseUrl }/terminal?q=${ query }`);
    }

    post( row: Terminal ): Observable<Terminal> {
        return this.http.post<Terminal>(`${ this.configService.baseUrl }/terminal`, row);
    }

    patch( row: Terminal ): Observable<Terminal> {
        if ( !row.terminalId ) throw Error('Row id is required');
        return this.http.patch<Terminal>(`${ this.configService.baseUrl }/terminal/${ row.terminalId }`, row );
    }

    deleteById( id: string ): Observable<boolean> {
        return this.http.delete(`${ this.configService.baseUrl }/terminal/${ id }`)
        .pipe(
            map( resp => true ),
            catchError( err => of(false) ),
        );
    }
}