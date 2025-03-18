import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

import { User } from './user.interfaces';
import { environment } from './../../environments/environment';
import { ConfigJsonService } from '../services/configJson.service';

@Injectable({ providedIn: 'root' })
export class UserService {
    

    private http = inject(HttpClient);

    constructor(private configService: ConfigJsonService) { }
    
    getAll():Observable<User[]> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        return this.http.get<User[]>(`${ this.configService.baseUrl }/user`, { headers });
    }

    getById( id: string ): Observable<User | undefined> {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
        return this.http.get<User>(`${ this.configService.baseUrl }/user/${ id }`, { headers })
        .pipe(catchError( error => of(undefined) ));
    }

    getByEmailPassword( email: string, password: string ): Observable<User | null> {

        const params = new HttpParams()
        .set('email', email)
        .set('password', password)
        
        return this.http.get<User[]>(`${ this.configService.baseUrl }/user`, { params })
        .pipe(
            map( users => users.length > 0 ? users[0]: null ),
            catchError( () => of(null) )
        );
    }

    getByQuery( query: string ): Observable<User[]> {
        return this.http.get<User[]>(`${ this.configService.baseUrl }/user?q=${ query }&_limit=100`);
    }

    post( row: User ): Observable<User> {
        return this.http.post<User>(`${ this.configService.baseUrl }/user`, row );
    }

    patch( row: User ): Observable<User> {
        if ( !row.userId ) throw Error('Row id is required');
        return this.http.patch<User>(`${ this.configService.baseUrl }/user/${ row.userId }`, row );
    }

    deleteById( id: string ): Observable<boolean> {
        return this.http.delete(`${ this.configService.baseUrl }/user/${ id }`)
        .pipe(
            map( resp => true ),
            catchError( err => of(false) ),
        );
    }
}