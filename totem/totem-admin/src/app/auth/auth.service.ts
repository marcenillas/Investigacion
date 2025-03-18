import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of, map, catchError, throwError } from 'rxjs';

import { AuthResponse, AuthStatus, Session } from './auth.interfaces';
import { User } from '../user/user.interfaces';
import { ConfigJsonService } from '../services/configJson.service';

@Injectable({ providedIn: 'root' })
export class AuthService {

    private http = inject(HttpClient);
    
    private _currentUser = signal<Session | null>(null);
    private _authStatus = signal<AuthStatus>(AuthStatus.checking);

    public currentUser = computed(() => this._currentUser());
    public authStatus = computed(() => this._authStatus());

    constructor(private configService: ConfigJsonService) { 
        console.log('AuthService.constructor');
        console.log(this.configService.baseUrl);
        this.checkAuthentication().subscribe();   }

    private setAuthentication(userId: string, email: string, fullName: string, token: string): boolean {
        this._currentUser.set({ userId, email, fullName, token });
        this._authStatus.set(AuthStatus.authenticated);

        localStorage.setItem('userId', userId)
        localStorage.setItem('email', email)
        localStorage.setItem('fullName', fullName)
        localStorage.setItem('token', token);

        return true;
    }

    login(email: string, password: string): Observable<boolean> {

        const url = `${this.configService.baseUrl}/auth/login`;
        const body = { email, password };

        return this.http.post<AuthResponse>(url, body)
            .pipe(
                map(({ userId, email, fullName, token }) => this.setAuthentication(userId, email, fullName, token)),
                catchError(err => throwError(() => err.error))
            );
    }

    logout() {
        localStorage.clear();
        this._currentUser.set(null);
        this._authStatus.set(AuthStatus.notAuthenticated);
    }

    account( row: User ): Observable<User> {
        if ( !row.userId ) throw Error('Row id is required');
        return this.http.patch<User>(`${ this.configService.baseUrl }/auth/account`, row );
    }

    checkAuthentication(): Observable<boolean> {

        const url = `${this.configService.baseUrl}/auth/check-status`;
        const token = localStorage.getItem('token');

        if (!token) {
            this.logout();
            return of(false);
        }

        const headers = new HttpHeaders()
            .set('Authorization', `Bearer ${token}`);

        return this.http.get<AuthResponse>(url, { headers })
            .pipe(
                map(({ userId, email, fullName, token }) => this.setAuthentication(userId, email, fullName, token)),
                catchError(() => {
                    this._authStatus.set(AuthStatus.notAuthenticated);
                    return of(false);
                })
            );
    }

    getSession(): Session {
        const userId = localStorage.getItem('userId') ?? '';
        const email = localStorage.getItem('email') ?? '';
        const fullName = localStorage.getItem('fullName') ?? '';
        const token = localStorage.getItem('token') ?? '';

        return { userId, email, fullName, token };
    }
}