import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';

import { Filter, TransactionLog } from './transaction.interfaces';
import { Transaction } from './transaction.interfaces';
import { environment } from './../../environments/environment';
import { PaginationDTO } from '../../../../sielcon-pay-backend/src/common/dtos/pagination.data';
import { ConfigJsonService } from '../services/configJson.service';

@Injectable({ providedIn: 'root' })
export class TransactionService {
    
  
    private http = inject(HttpClient);

     constructor(private configService: ConfigJsonService) { }  

    getAll(p?: PaginationDTO): Observable<{ data: Transaction[]; count: number }> {
        const url = p ? `${this.configService.baseUrl}/transaction?limit=${p.limit}&offset=${p.offset}` : `${this.configService.baseUrl}/transaction`;
      
        return this.http.get<{ data: Transaction[]; count: number }>(url);
      }


    getById( id: string ): Observable<Transaction | undefined> {
        return this.http.get<Transaction>(`${ this.configService.baseUrl }/transaction/${ id }`)
        .pipe(
            catchError( error => of(undefined) )
        );
    }

    getLogById( id: string ): Observable<TransactionLog[]> {
        return this.http.get<TransactionLog[]>(`${ this.configService.baseUrl }/TransactionLog/transaction/${ id }`)
        
    }


    getByQuery( query: string ): Observable<Transaction[]> {
        return this.http.get<Transaction[]>(`${ this.configService.baseUrl }/transaction?q=${ query }`);
    }


    getByFilter(filter: Filter ):  Observable<{ data: Transaction[]; count: number }> {
    
        return this.http.post<{ data: Transaction[]; count: number }>(`${ this.configService.baseUrl }/Transaction/TransactionByFilter`, filter);
    
             
    }
}